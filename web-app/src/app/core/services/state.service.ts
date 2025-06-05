import { inject, Injectable } from '@angular/core';
import { CardFormatsService } from './card-formats.service';
import { CardsService } from './cards.service';
import { DecksService } from './decks.service';
import { Entity, isDeck, isGenericCardDescriptor } from '../models';
import { produce } from 'immer';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private decksService = inject(DecksService);
  private cardsService = inject(CardsService);
  // private cardFormatsService = inject(CardFormatsService);

  downloadJson(): void {
    const renameMap: Record<string, string> = {};
    const json = JSON.stringify({
      cards: this.cardsService
        .getListSnapshot()
        .map((card) => this.changeIds(card, renameMap)),
      decks: this.decksService
        .getListSnapshot()
        .map((deck) => this.changeIds(deck, renameMap)),
      // cardFormats: this.cardFormatsService.getListSnapshot(),
    });
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pf2-cards.json';
    a.click();
  }

  uploadJson(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      const json = e.target?.result as string;
      const data = JSON.parse(json);
      this.decksService.add(data.decks, true);
      this.cardsService.add(data.cards, true);
      // this.cardFormatsService.add(data.cardFormats, true);
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
