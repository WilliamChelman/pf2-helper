import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardsService } from '@/core';
import { CdkMenuModule } from '@angular/cdk/menu';

@Component({
  selector: 'app-card-adder',
  standalone: true,
  imports: [CdkMenuModule],
  template: `
    <div class="fixed bottom-4 right-4 z-10">
      <button
        class="btn btn-primary btn-circle shadow-lg"
        [cdkMenuTriggerFor]="menu"
        cdkMenuTrigger
      >
        <i class="bx bx-plus"></i>
      </button>

      <ng-template #menu>
        <div cdkMenu class="w-52 bg-base-100 shadow-lg rounded-lg py-2 mt-2">
          @for (type of types; track type.id) {
            <button
              cdkMenuItem
              class="flex items-center gap-2 px-4 py-2 w-full hover:bg-base-200 text-left"
              (click)="onCardTypeSelect(type)"
            >
              <i [class]="type.iconClass">{{ type.iconLabel }}</i>
              {{ type.label }}
            </button>
          }
        </div>
      </ng-template>
    </div>
  `,
  styles: [
    `
      :host ::ng-deep .cdk-overlay-pane {
        transform-origin: bottom right !important;
      }
    `,
  ],
})
export class CardAdder {
  cardsService = inject(CardsService);
  types: CardType[] = [
    { id: 'generic', label: 'Generic Template', iconClass: 'bx bx-blocks' },
    {
      id: 'action',
      label: 'Action Template',
      iconClass: 'font-pf not-italic',
      iconLabel: '[one-action]',
    },
    {
      id: 'spell',
      label: 'Spell Template',
      iconClass: 'bx bx-bookmark-alt',
    },
  ];

  @Output()
  cardCreated = new EventEmitter<string>();

  onCardTypeSelect(cardType: CardType) {
    const card = this.cardsService.createEntityShell('generic');
    card.middleSections = [{ content: 'Action description', label: '' }];
    card.fontSize = 6;
    card.actionTypes = ['one'];
    if (cardType.id === 'action') {
      card.name = 'New Action Card';
      card.traits = ['Action'];
      card.bottomSections = [
        { label: 'Critical Success', content: 'crit' },
        { label: 'Success', content: 'success' },
        { label: 'Failure', content: 'failure' },
        { label: 'Critical Failure', content: 'crit-fail' },
      ];
    } else if (cardType.id === 'spell') {
      card.actionTypes = ['two'];
      card.name = 'New Spell Card';
      card.traits = ['Holy'];
      card.category = 'Cantrip 1';
      card.topSections = [
        { label: 'Range', content: 'Self' },
        { label: 'Duration', content: 'Instantaneous' },
      ];
      card.bottomSections = [
        { label: 'Heightened (+2)', content: 'The damage increases by 1d6' },
      ];
    }
    this.cardsService.add(card);
    this.cardCreated.emit(card.id);
  }
}

interface CardType {
  id: string;
  label: string;
  iconClass: string;
  iconLabel?: string;
}
