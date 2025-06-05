import { CardFormat, CardsService, DisplayMode } from '@/core';
import { notNil } from '@/utils/not-nil.util';
import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { filter, switchMap } from 'rxjs';
import { GenericCardComponent } from '../generic-card';

@Component({
  selector: 'app-any-card',
  imports: [GenericCardComponent],
  template: `
    @let card = card$();
    @if (card && card.type === 'generic') {
      <app-generic-card
        [displayMode]="displayMode()"
        [format]="format()"
        [card]="$any(card)"
        (removed)="removed.emit(card.id)"
        (duplicated)="duplicated.emit($event)"
      />
    }
  `,
  styles: ``,
})
export class AnyCard {
  @Output()
  removed = new EventEmitter<string>();

  @Output()
  duplicated = new EventEmitter<string>();

  cardsService = inject(CardsService);
  format = input<CardFormat>();
  cardId = input<string>();
  displayMode = input<DisplayMode>();
  card$ = toSignal(
    toObservable(this.cardId).pipe(
      filter(notNil),
      switchMap((id) => this.cardsService.selectById(id)),
    ),
  );
}
