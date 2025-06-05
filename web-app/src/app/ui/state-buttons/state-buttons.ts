import { Component, inject, signal } from '@angular/core';
import { StateService } from '../../core/services/state.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-state-buttons',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex gap-2">
      <button
        class="btn btn-primary"
        (click)="onDownload()"
        [disabled]="isDownloading()"
      >
        @if (isDownloading()) {
          <span class="loading loading-spinner loading-sm"></span>
        } @else {
          <i class="bx bx-folder-down-arrow"></i>
          Download State
        }
      </button>

      <label class="btn btn-secondary" [class.loading]="isUploading()">
        @if (isUploading()) {
          <span class="loading loading-spinner loading-sm"></span>
        } @else {
          <i class="bx bx-folder-up-arrow"></i>
          Upload State
        }
        <input
          type="file"
          class="hidden"
          accept=".json"
          (change)="onFileSelected($event)"
          [disabled]="isUploading()"
        />
      </label>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class StateButtons {
  private stateService = inject(StateService);

  isDownloading = signal(false);
  isUploading = signal(false);

  onDownload(): void {
    this.isDownloading.set(true);
    try {
      this.stateService.downloadJson();
    } finally {
      this.isDownloading.set(false);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    this.isUploading.set(true);
    try {
      this.stateService.uploadJson(file);
    } finally {
      this.isUploading.set(false);
      // Reset the input so the same file can be selected again
      input.value = '';
    }
  }
}
