import { Injectable } from '@angular/core';
import { GenericCardDescriptor } from '../models/card-descriptor';
import { EntityService } from './entity.service';

@Injectable({
  providedIn: 'root',
})
export class CardsService extends EntityService<GenericCardDescriptor> {
  protected getStorageKey(): string {
    return 'pf2-cards';
  }

  getTypes(): CardType[] {
    return [
      { id: 'actionCard', label: 'Action Card', icon: 'bx bx-star' },
      { id: 'generic', label: 'Generic Card', icon: 'bx bx-blocks' },
    ];
  }
}

export interface CardType {
  id: string;
  label: string;
  icon: string;
}
