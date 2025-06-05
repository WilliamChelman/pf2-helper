import { CardFormat, CardsService, DisplayMode } from '@/core';
import { notNil } from '@/utils/not-nil';
import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, switchMap } from 'rxjs';
import { GenericCard } from '../generic-card/generic-card';

@Component({
  selector: 'app-any-card',
  imports: [AsyncPipe, GenericCard],
  template: `
    @let card = card$ | async;
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
  card$ = toObservable(this.cardId).pipe(
    filter(notNil),
    switchMap((id) => this.cardsService.selectById(id)),
  );
}
