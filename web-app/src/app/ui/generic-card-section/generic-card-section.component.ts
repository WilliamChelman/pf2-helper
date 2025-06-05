import { CardsService, GenericCard, GenericSection } from '@/core';
import { Component, computed, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { produce } from 'immer';
import { ContentEditable } from '../content-editable.util';

@Component({
  selector: 'app-generic-card-section',
  imports: [FormsModule, ContentEditable],
  template: `
    <div class="relative group/section min-w-[1.5em] text-justify">
      @if (showLabel()) {
        <span
          class="font-bold mr-[0.25em]"
          appContentEditable
          [ngModel]="section()?.label"
          (ngModelChange)="changeSectionValue('label', $event)"
        ></span>
      }
      <span
        appContentEditable
        [ngModel]="section()?.content"
        (ngModelChange)="changeSectionValue('content', $event)"
      ></span>

      <div
        class="absolute z-10 top-0 left-[-1em] opacity-0 group-hover/section:opacity-100 group-focus-within/section:opacity-100 transition-opacity duration-200 print:hidden"
      >
        <button
          class="btn btn-circle btn-xs h-[1em] w-[1em] text-error"
          (click)="removeSection()"
          aria-label="Delete property"
        >
          <i class="bx bx-trash"></i>
        </button>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class GenericCardSection {
  card = input.required<GenericCard>();
  property = input.required<
    'bottomSections' | 'topSections' | 'middleSections'
  >();
  index = input.required<number>();
  showLabel = input<boolean>(true);
  section = computed(() => this.card()[this.property()]?.[this.index()]);

  cardsService = inject(CardsService);

  changeSectionValue(key: keyof GenericSection, value: string) {
    const updatedCard = produce(this.card(), (draft) => {
      const sections = draft[this.property()];
      if (!sections) return;
      const section = sections?.[this.index()];
      if (!section) return;
      section[key] = value;
    });
    this.cardsService.update(updatedCard);
  }

  removeSection() {
    const updatedCard = produce(this.card(), (draft) => {
      const sections = draft[this.property()];
      if (!sections) return;
      sections.splice(this.index(), 1);
    });
    this.cardsService.update(updatedCard);
  }
}
