import { Entity } from './entity';

export interface Deck extends Entity {
  name: string;
  type: 'deck';
  format?: string;
  cards?: string[];
}

export function isDeck(entity: Entity): entity is Deck {
  return entity.type === 'deck';
}
