import { inject, Injectable } from '@angular/core';
import { CardFormatsService } from './card-formats.service';
import { CardsService } from './cards.service';
import { DecksService } from './decks.service';
import { Card, Deck, Entity, isDeck, isGenericCardDescriptor } from '../models';
import { produce } from 'immer';
import { downloadBlob } from '@/utils';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private decksService = inject(DecksService);
  private cardsService = inject(CardsService);

  downloadAll(): void {
    this.downloadDecks(
      this.decksService.getListSnapshot(),
      this.cardsService.getListSnapshot(),
      'all-decks.json',
    );
  }

  downloadDecks(decks: Deck[], cards: Card[], filename: string): void {
    const renameMap: Record<string, string> = {};
    const json = JSON.stringify({
      cards: cards.map((card) => this.changeIds(card, renameMap)),
      decks: decks.map((deck) => this.changeIds(deck, renameMap)),
    });
    downloadBlob(new Blob([json], { type: 'application/json' }), filename);
  }

  uploadJson(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      const json = e.target?.result as string;
      const data = JSON.parse(json);
      this.decksService.add(data.decks, true);
      this.cardsService.add(data.cards, true);
    };
    reader.onerror = (e) => {
      console.error('Error reading file', e);
    };
    reader.readAsText(file);
  }

  private changeIds(entity: Entity, nameMap: Record<string, string>): Entity {
    return produce(entity, (draft) => {
      const newId = crypto.randomUUID();
      nameMap[draft.id] = newId;
      draft.id = newId;

      if (isDeck(draft) && draft.cards) {
        draft.cards = draft.cards.map((card) => {
          if (card in nameMap) {
            return nameMap[card];
          }
          return card;
        });
      }
    });
  }
}
