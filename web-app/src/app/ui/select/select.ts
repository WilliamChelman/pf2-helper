import { A11yModule } from '@angular/cdk/a11y';
import { CdkListboxModule } from '@angular/cdk/listbox';
import { CdkOverlayOrigin, OverlayModule } from '@angular/cdk/overlay';
import {
  Component,
  computed,
  effect,
  ElementRef,
  forwardRef,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption<T = any> {
  label: string;
  value: T;
  disabled?: boolean;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CdkListboxModule, OverlayModule, A11yModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Select),
      multi: true,
    },
  ],
  template: `
    <!-- Trigger Button -->
    <button
      #triggerButton
      type="button"
      class="select select-bordered w-full text-left flex items-center justify-between"
      [class.select-disabled]="disabled() || isDisabled"
      [attr.aria-expanded]="isOpen()"
      [attr.aria-haspopup]="'listbox'"
      [attr.aria-label]="label()"
      (click)="toggleDropdown()"
      (blur)="onBlur()"
      cdkOverlayOrigin
      #trigger="cdkOverlayOrigin"
    >
      @if (selectedOption()) {
        {{ selectedOption()?.label }}
      } @else {
        {{ placeholder() }}
      }
    </button>

    <!-- Dropdown List -->
    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="trigger"
      [cdkConnectedOverlayOpen]="isOpen()"
      [cdkConnectedOverlayHasBackdrop]="true"
      [cdkConnectedOverlayBackdropClass]="'cdk-overlay-transparent-backdrop'"
      [cdkConnectedOverlayPositions]="[
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetY: 4,
        },
      ]"
      (overlayOutsideClick)="closeDropdown()"
      (detach)="isOpen.set(false)"
    >
      <ul
        role="listbox"
        class="bg-base-100 rounded-lg shadow-lg border border-base-300 max-h-60 overflow-auto min-w-[var(--trigger-width)]"
        cdkListbox
        #optionsList
        [cdkListboxValue]="selectedValue() ? [selectedValue()] : []"
        (cdkListboxValueChange)="onListboxValueChange($event)"
        [cdkListboxDisabled]="disabled() || isDisabled"
      >
        @for (option of options(); track option.value) {
          <li
            class="w-full text-left px-4 py-2 cursor-pointer hover:bg-base-200 aria-selected:font-bold"
            [cdkOption]="option.value"
          >
            {{ option.label }}
          </li>
        }
      </ul>
    </ng-template>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }
    `,
  ],
})
export class Select<T = any> implements ControlValueAccessor {
  triggerButton = viewChild<ElementRef<HTMLButtonElement>>('triggerButton');
  trigger = viewChild<CdkOverlayOrigin>('trigger');
  optionsList = viewChild<ElementRef<HTMLUListElement>>('optionsList');

  options = input.required<SelectOption<T>[]>();
  placeholder = input('Select an option');
  label = input('Select');
  disabled = input(false);

  protected isOpen = signal(false);
  protected selectedValue = signal<T | null>(null);
  protected selectedOption = computed(() =>
    this.options().find((opt) => opt.value === this.selectedValue()),
  );

  private onChange: (value: T | null) => void = () => {};
  private onTouched: () => void = () => {};
  protected isDisabled = false;
  protected isDirty = false;
  protected isTouched = false;

  constructor() {
    // Update trigger width when options change
    effect(() => {
      const options = this.options();
      if (options.length > 0) {
        this.updateTriggerWidth();
      }
    });
  }

  private updateTriggerWidth(): void {
    const trigger = this.triggerButton()?.nativeElement;
    if (trigger) {
      const width = trigger.offsetWidth;
      trigger.style.setProperty('--trigger-width', `${width}px`);
    }
  }

  // ControlValueAccessor implementation
  writeValue(value: T | null): void {
    const hasOption = this.options().some((opt) => opt.value === value);
    if (hasOption) {
      this.selectedValue.set(value);
    } else {
      this.selectedValue.set(null);
    }
  }

  registerOnChange(fn: (value: T | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  protected toggleDropdown(): void {
    if (this.disabled() || this.isDisabled) return;
    this.isOpen.update((v) => !v);
    if (this.isOpen()) {
      setTimeout(() => {
        this.optionsList()?.nativeElement.focus();
      });
    }
  }

  protected closeDropdown(): void {
    this.isOpen.set(false);
  }

  protected selectOption(value: T): void {
    this.selectedValue.set(value);
    this.isDirty = true;
    this.onChange(value);
    this.closeDropdown();
    this.triggerButton()?.nativeElement.focus();
  }

  protected onListboxValueChange(event: {
    value: readonly (T | null)[];
  }): void {
    const value = event.value[0];
    if (value !== undefined) {
      this.selectOption(value as T);
    }
  }

  protected onBlur(): void {
    this.isTouched = true;
    this.onTouched();
  }
}
