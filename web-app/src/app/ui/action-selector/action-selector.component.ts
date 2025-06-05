import { Pf2IconType } from '@/core';
import { CdkMenuItemCheckbox, CdkMenuModule } from '@angular/cdk/menu';
import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Pf2Icon } from '../pf2-icon';

@Component({
  selector: 'app-action-selector',
  imports: [CommonModule, CdkMenuModule, CdkMenuItemCheckbox, Pf2Icon],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ActionSelector,
      multi: true,
    },
  ],
  template: `
    <button
      class="btn bg-transparent p-0 h-[unset] border-0 text-[length:inherit] leading-[normal]"
      [cdkMenuTriggerFor]="menu"
      cdkMenuTrigger
      [disabled]="disabled"
    >
      @if (isOneToThree()) {
        <i pf2-icon type="one"></i> to <i pf2-icon type="three"></i>
      } @else {
        @for (value of sortedValues(); track value; let first = $first) {
          @if (!first) {
            or
          }
          <i pf2-icon [type]="value"></i>
        }
      }
    </button>

    <ng-template #menu>
      <div
        cdkMenu
        class="bg-base-100 shadow-lg rounded-lg py-2"
        (clickOutside)="onTouched()"
      >
        @for (action of actions; track action) {
          <button
            class="flex items-center gap-2 justify-between px-4 py-2 w-full hover:bg-base-200 text-left"
            cdkMenuItemCheckbox
            [cdkMenuItemChecked]="values().includes(action)"
            (cdkMenuItemTriggered)="onActionSelect(action)"
          >
            <i pf2-icon [type]="action"></i>
            @if (values().includes(action)) {
              <i class="bx bx-check"></i>
            }
          </button>
        }
      </div>
    </ng-template>
  `,
  styles: ``,
})
export class ActionSelector implements ControlValueAccessor {
  disabled = false;
  private onChange: (value: string[]) => void = () => {};
  onTouched: () => void = () => {};

  actions: Pf2IconType[] = ['one', 'two', 'three', 'reaction', 'free'];
  values = signal<Pf2IconType[]>([]);
  isOneToThree = computed(
    () =>
      this.values().length === 3 &&
      this.values().includes('one') &&
      this.values().includes('two') &&
      this.values().includes('three'),
  );
  sortedValues = computed(() =>
    this.values().sort(
      (a, b) => this.actions.indexOf(a) - this.actions.indexOf(b),
    ),
  );

  setValues(values: Pf2IconType[]) {
    this.values.set(values);
    this.onChange(this.values());
    this.onTouched();
  }

  onActionSelect(action: Pf2IconType) {
    const current = this.values();
    let next;
    if (current.includes(action)) {
      next = current.filter((value) => value !== action);
    } else {
      next = [...current, action];
    }
    this.setValues(next);
  }

  writeValue(value: string[]): void {
    this.values.set((value ?? []) as Pf2IconType[]);
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}

type DisplayCase = 'single' | '';
