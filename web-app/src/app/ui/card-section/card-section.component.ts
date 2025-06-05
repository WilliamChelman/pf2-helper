import { CardsService, GenericCard } from '@/core';
import { Component, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContentEditable } from '../content-editable.util';

@Component({
  selector: 'app-card-section',
  imports: [FormsModule, ContentEditable],
  template: `
    <div class="relative group/section min-w-[1.5em]">
      @if (label()) {
        <span class="font-bold mr-[0.25em]">{{ label() }}:</span>
      }

      <span
        appContentEditable
        [ngModel]="card()[property()]"
        (ngModelChange)="
          cardsService.changeProperty(card(), property(), $event)
        "
      ></span>
    </div>

    <div
      class="absolute z-10 top-0 left-0 opacity-0 group-hover/section:opacity-100 group-focus-within/section:opacity-100 transition-opacity duration-200 print:hidden"
    >
      <button
        class="btn btn-circle btn-sm bg-white/90 hover:bg-white shadow-lg text-error"
        (click)="cardsService.removeProperty(card(), property())"
        aria-label="Delete property"
      >
        <i class="bx bx-trash text-lg"></i>
      </button>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class CardSection<T extends GenericCard> {
  label = input<string>();
  card = input.required<T>();
  property = input.required<keyof T>();

  cardsService = inject(CardsService);
}
