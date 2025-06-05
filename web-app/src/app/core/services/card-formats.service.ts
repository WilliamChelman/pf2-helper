import { Injectable } from '@angular/core';
import { CardFormat, cardSizes } from '../models';
import { EntityService } from './entity.service';

@Injectable({
  providedIn: 'root',
})
export class CardFormatsService extends EntityService<CardFormat> {
  protected override getDefaultEntities(): CardFormat[] {
    return Object.entries(cardSizes).map(([key, value]) => ({
      id: key,
      type: 'card-format',
      name: `${key} (${value.width}mm x ${value.height}mm)`,
      ...value,
    }));
  }

  protected getStorageKey(): string {
    return 'pf2-card-formats';
  }
}
