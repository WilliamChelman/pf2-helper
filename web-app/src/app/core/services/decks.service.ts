import { inject, Injectable } from '@angular/core';
import { Deck, Many } from '../models';
import { EntityService } from './entity.service';
import { CardsService } from './cards.service';
import { produce } from 'immer';

@Injectable({
  providedIn: 'root',
})
export class DecksService extends EntityService<Deck> {
  #cardsService = inject(CardsService);

  override remove(entityOrIds: Deck | string): void {
    const entity =
      typeof entityOrIds === 'string'
        ? this.getListSnapshot().find((e) => e.id === entityOrIds)
        : entityOrIds;
    if (!entity) return;
    entity.cards?.forEach((card) => {
      this.#cardsService.remove(card);
    });
    super.remove(entity);
  }

  override duplicate(entity: Deck): string {
    const newDeckId = super.duplicate(entity);
    let newDeck = this.getListSnapshot().find((e) => e.id === newDeckId);
    if (!newDeck) return newDeckId;

    newDeck = produce(newDeck, (draft) => {
      draft.cards =
        entity.cards?.map((cardId) => {
          const card = this.#cardsService.getById(cardId);
          if (!card) return cardId;
          return this.#cardsService.duplicate(card);
        }) ?? [];
    });
    this.update(newDeck);
    return newDeckId;
  }

  protected getStorageKey(): string {
    return 'pf2-decks';
  }

  override createEntityShell(type: string): Deck {
    const shell = super.createEntityShell(type);
    shell.format = 'std';
    return shell;
  }
}
