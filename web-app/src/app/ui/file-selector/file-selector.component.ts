import { NgClass } from '@angular/common';
import { Component, forwardRef, Input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-file-selector',
  standalone: true,
  imports: [NgClass],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileSelector),
      multi: true,
    },
  ],
  template: `
    <div
      class="relative w-full min-h-[150px] border-2 border-dashed rounded-lg p-4 transition-colors"
      [ngClass]="{
        'border-primary': isDragging(),
        'border-base-300': !isDragging(),
        'bg-base-200/50': isDragging(),
      }"
      (dragover)="onDragOver($event)"
      (dragleave)="onDragLeave($event)"
      (drop)="onDrop($event)"
      (click)="fileInput.click()"
      role="button"
      tabindex="0"
      (keydown.enter)="fileInput.click()"
      aria-label="File selector drop zone"
    >
      <input
        #fileInput
        type="file"
        class="hidden"
        (change)="onFileSelected($event)"
        [accept]="accept"
        [multiple]="multiple"
      />

      <div class="flex flex-col items-center justify-center gap-2 text-center">
        @if (selectedFiles().length > 0) {
          <div class="flex flex-wrap gap-2">
            @for (file of selectedFiles(); track file.name) {
              <div class="badge badge-primary gap-2">
                {{ file.name }}
                <button
                  class="btn btn-ghost btn-xs"
                  (click)="removeFile(file); $event.stopPropagation()"
                  aria-label="Remove file"
                >
                  ✕
                </button>
              </div>
            }
          </div>
        } @else {
          <div class="text-base-content/70">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8 mx-auto mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p class="text-sm font-medium">
              Drop files here or click to select
            </p>
            <p class="text-xs">
              {{
                accept ? 'Accepted types: ' + accept : 'All file types accepted'
              }}
            </p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
    `,
  ],
})
export class FileSelector implements ControlValueAccessor {
  @Input() accept = '';
  @Input() multiple = false;

  selectedFiles = signal<File[]>([]);
  isDragging = signal(false);

  private onChange: (value: File[]) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(files: File[]): void {
    if (files) {
      this.selectedFiles.set(files);
    }
  }

  registerOnChange(fn: (value: File[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Implement if needed
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(Array.from(files));
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(Array.from(input.files));
    }
    // Reset the input value to allow selecting the same file again
    input.value = '';
  }

  private handleFiles(files: File[]): void {
    const validFiles = this.multiple ? files : [files[0]];
    this.selectedFiles.set(validFiles);
    this.onChange(validFiles);
    this.onTouched();
  }

  removeFile(file: File): void {
    this.selectedFiles.update((files) => files.filter((f) => f !== file));
    this.onChange(this.selectedFiles());
    this.onTouched();
  }
}
