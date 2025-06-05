import { CardFormat, CardsService, DisplayMode, GenericCard } from '@/core';
import { ContentEditable } from '@/ui/content-editable.util';
import { NgClass, NgStyle } from '@angular/common';
import {
  Component,
  computed,
  EventEmitter,
  inject,
  input,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActionSelector } from '../action-selector';
import { CardDividerComponent } from '../card-divider';
import { GenericCardControls } from '../generic-card-controls';
import { GenericCardSection } from '../generic-card-section';

@Component({
  selector: 'app-generic-card',
  imports: [
    FormsModule,
    ContentEditable,
    ActionSelector,
    GenericCardControls,
    GenericCardSection,
    CardDividerComponent,
    NgStyle,
    NgClass,
  ],
  template: `
    <app-generic-card-controls
      [displayMode]="displayMode()"
      [ngStyle]="{
        'font-size.pt': card().fontSize,
      }"
      [format]="format()"
      [card]="card()"
      (duplicated)="duplicated.emit($event)"
      (removed)="removed.emit()"
    >
      <!-- Header -->
      <div class="flex flex-nowrap rounded text-[1.5em] items-center">
        <h2
          class="flex-grow font-cinzel font-bold leading-[normal]"
          [ngClass]="{
            'flex-grow': card().category == null,
            'mr-[0.25em]': card().category != null,
          }"
          appContentEditable
          [ngModel]="card().name"
          (ngModelChange)="cardsService.changeProperty(card(), 'name', $event)"
        ></h2>

        <app-action-selector
          class="flex-shrink-0"
          [ngModel]="card().actionTypes"
          (ngModelChange)="
            cardsService.changeProperty(card(), 'actionTypes', $event)
          "
        ></app-action-selector>
        @if (card().category != null) {
          <div class="flex-1"></div>
          <h3
            class="flex-grow font-cinzel font-bold leading-[normal] text-end"
            appContentEditable
            [ngModel]="card().category"
            (ngModelChange)="
              cardsService.changeProperty(card(), 'category', $event)
            "
          ></h3>
        }
      </div>

      <!-- Traits -->
      @if (card().traits) {
        <app-card-divider />

        <div class="flex flex-wrap gap-1 items-center text-[1.25em]">
          @for (trait of card().traits; track i; let i = $index) {
            <span class="relative group/trait  bg-red-500 px-1 rounded-xs flex">
              <span
                class="text-white"
                appContentEditable
                [ngModel]="trait"
                (ngModelChange)="
                  cardsService.changeProperty(card(), 'traits', $event, i)
                "
              ></span>
              <button
                class="btn btn-square h-[1.25em] w-[1.25em] absolute top-full right-0 opacity-0 group-hover/trait:opacity-100 group-focus-within/trait:opacity-100 transition-opacity duration-200"
                (click)="cardsService.removeFromPropertyAt(card(), 'traits', i)"
              >
                <i class="bx bx-trash text-xxs"></i>
              </button>
            </span>
          }
          <button
            class="btn btn-square h-[1.25em]! w-[1.25em]! print:hidden"
            (click)="cardsService.addToProperty(card(), 'traits', 'Trait')"
          >
            <i class="bx bx-plus text-xxs"></i>
          </button>
        </div>
      }

      <div class="font-merriweather">
        @for (property of sectionProperties; track property) {
          @if (card()[property]?.length) {
            <app-card-divider />
            @for (section of card()[property]; track i; let i = $index) {
              <app-generic-card-section
                [card]="card()"
                [property]="property"
                [index]="i"
                [showLabel]="property !== 'middleSections'"
              />
            }
          }
        }
      </div>
    </app-generic-card-controls>
  `,
  styles: ``,
})
export class GenericCardComponent {
  displayMode = input<DisplayMode>();
  card = input.required<GenericCard>();
  format = input<CardFormat>();
  sectionsToAdd = computed(() => {
    return ['topSections', 'bottomSections'] as const;
  });
  sectionProperties = [
    'topSections',
    'middleSections',
    'bottomSections',
  ] as const;
  @Output() removed = new EventEmitter<void>();
  @Output() duplicated = new EventEmitter<string>();

  cardsService = inject(CardsService);
}
