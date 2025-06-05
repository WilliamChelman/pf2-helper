import {
  CardFormat,
  CardsService,
  DisplayMode,
  GenericCard,
  GenericSectionProperty,
  SelectOption,
} from '@/core';
import { NgClass, NgStyle } from '@angular/common';
import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { produce } from 'immer';
import { CdkMenuModule } from '@angular/cdk/menu';

@Component({
  selector: 'app-generic-card-controls',
  standalone: true,
  imports: [CdkMenuModule, NgStyle, NgClass],
  template: `
    <div
      class="relative group break-inside-avoid border border-gray-300/50 px-3 py-2 transition-all duration-300 print:rounded-none"
      [ngClass]="{
        'bg-stone-50': displayMode() !== 'back',
        'bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 outline-[3mm] outline-offset-[-1mm]':
          displayMode() === 'back',
        'opacity-50': card().printHidden,
      }"
      [ngStyle]="{
        'width.mm': format()?.width ?? 80,
        'height.mm': format()?.height ?? 120,
      }"
    >
      @if (displayMode() === 'back') {
        <!-- Fantasy Card Back Design -->
        <div class="absolute inset-0 overflow-hidden">
          <!-- Decorative border pattern -->
          <div
            class="absolute inset-2 border-2 border-gold rounded opacity-50"
          ></div>
          <div
            class="absolute inset-4 border border-gold rounded opacity-30"
          ></div>

          <!-- Central emblem -->
          <div class="absolute inset-0 flex items-center justify-center">
            <div
              class="w-24 h-24 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30 flex items-center justify-center"
            >
              <div
                class="w-16 h-16 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 border border-gold/40 flex items-center justify-center"
              >
                <div
                  class="w-8 h-8 rounded-full bg-gradient-to-br from-gold/40 to-gold/20 border border-gold/50"
                ></div>
              </div>
            </div>
          </div>

          <!-- Corner decorations -->
          <div
            class="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-gold opacity-50"
          ></div>
          <div
            class="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-gold opacity-50"
          ></div>
          <div
            class="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-gold opacity-50"
          ></div>
          <div
            class="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-gold opacity-50"
          ></div>
        </div>
      } @else {
        <!-- Content projection slot for front of card -->
        <ng-content></ng-content>
      }

      <!-- Action buttons that appear on hover -->
      @let cardModel = card();

      <div
        class="absolute z-10 top-0 right-[-2.5rem] opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 flex flex-col gap-2 print:hidden"
      >
        <!-- Section Toggles Menu -->
        <button
          class="btn btn-circle btn-sm bg-white/90 hover:bg-white shadow-lg"
          [cdkMenuTriggerFor]="sectionMenu"
          cdkMenuTrigger
        >
          <i class="bx bx-blocks text-lg"></i>
        </button>

        <ng-template #sectionMenu>
          <div cdkMenu class="w-40 bg-base-100 shadow-lg rounded-lg py-2">
            @for (section of sectionToggles; track section) {
              <button
                cdkMenuItem
                class="btn btn-sm w-full justify-start px-4 py-2 hover:bg-base-200"
                [innerHTML]="section.label"
                (click)="section.cb()"
              ></button>
            }
          </div>
        </ng-template>

        <!-- Font Size Menu -->
        <button
          class="btn btn-circle btn-sm bg-white/90 hover:bg-white shadow-lg"
          [cdkMenuTriggerFor]="fontMenu"
          cdkMenuTrigger
        >
          <i class="bx bx-text-height text-lg"></i>
        </button>

        <ng-template #fontMenu>
          <div
            cdkMenu
            class="bg-base-100 shadow-lg rounded-lg py-2 min-w-[120px]"
          >
            @for (size of sizes; track size) {
              <button
                cdkMenuItem
                class="btn btn-sm flex items-center gap-2 justify-between w-full px-4 py-2 hover:bg-base-200"
                (click)="
                  cardsService.changeProperty(cardModel, 'fontSize', size.value)
                "
              >
                {{ size.label }}
                @if (cardModel.fontSize === size.value) {
                  <i class="bx bx-check"></i>
                }
              </button>
            }
          </div>
        </ng-template>

        <!-- Action Buttons -->
        <button
          class="btn btn-circle btn-sm bg-white/90 hover:bg-white shadow-lg"
          (click)="duplicate()"
          aria-label="Duplicate card"
        >
          <i class="bx bx-copy text-lg"></i>
        </button>
        <button
          class="btn btn-circle btn-sm bg-white/90 hover:bg-white shadow-lg"
          [ngClass]="{
            'text-warning': card().printHidden,
            'text-base-content': !card().printHidden,
          }"
          (click)="togglePrintVisibility()"
          aria-label="Toggle print visibility"
        >
          <i class="bx bx-printer text-lg"></i>
        </button>
        <button
          class="btn btn-circle btn-sm bg-white/90 hover:bg-white shadow-lg text-error"
          (click)="cardsService.remove(cardModel); removed.emit()"
          aria-label="Delete card"
        >
          <i class="bx bx-trash text-lg"></i>
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class GenericCardControls {
  card = input.required<GenericCard>();
  format = input<CardFormat>();
  displayMode = input<DisplayMode>();
  sectionToggles: SectionToggle[] = [
    {
      label: '<i class="bx bx-eye"> Action',
      cb: () => {
        const actions = this.card().actionTypes;
        if (!actions?.length) {
          this.cardsService.changeProperty(this.card(), 'actionTypes', ['one']);
        } else {
          this.cardsService.changeProperty(
            this.card(),
            'actionTypes',
            undefined,
          );
        }
      },
    },
    {
      label: '<i class="bx bx-eye"> Category',
      cb: () => {
        const category = this.card().category;
        if (!category) {
          this.cardsService.changeProperty(this.card(), 'category', 'Category');
        } else {
          this.cardsService.changeProperty(this.card(), 'category', undefined);
        }
      },
    },
    {
      label: '<i class="bx bx-eye"> Traits',
      cb: () => {
        const traits = this.card().traits;
        if (!traits?.length) {
          this.cardsService.changeProperty(this.card(), 'traits', ['Trait']);
        } else {
          this.cardsService.changeProperty(this.card(), 'traits', undefined);
        }
      },
    },
    {
      label: '<i class="bx bx-plus"> Top Section',
      cb: () => this.addSection('topSections'),
    },
    {
      label: '<i class="bx bx-plus"> Middle Section',
      cb: () => this.addSection('middleSections'),
    },
    {
      label: '<i class="bx bx-plus"> Bottom Section',
      cb: () => this.addSection('bottomSections'),
    },
  ];
  cardsService = inject(CardsService);

  @Output()
  removed = new EventEmitter<void>();

  @Output()
  duplicated = new EventEmitter<string>();

  sizes = this.getSizes();

  duplicate() {
    const card = this.card();
    if (!card) return;
    const newId = this.cardsService.duplicate(card);
    this.duplicated.emit(newId);
  }

  addSection(key: GenericSectionProperty) {
    const updatedCard = produce(this.card(), (draft) => {
      draft[key] ??= [];
      draft[key].push({ label: 'Section', content: 'content' });
    });
    this.cardsService.update(updatedCard);
  }

  togglePrintVisibility() {
    const card = this.card();
    if (!card) return;
    this.cardsService.changeProperty(card, 'printHidden', !card.printHidden);
  }

  private getSizes(): SelectOption<number>[] {
    const min = 5;
    const max = 10;
    const step = 0.5;
    const sizes: SelectOption<number>[] = [];
    for (let i = min; i <= max; i += step) {
      sizes.push({ label: `${i}pt`, value: i });
    }
    return sizes;
  }
}

type SectionToggle = {
  label: string;
  cb: () => void;
};
