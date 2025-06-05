import { Entity } from './entity.model';
import { Pf2IconType } from './pf2-icon-type.model';

export interface Card extends Entity {
  fontSize?: number;
}

export interface GenericCard extends Card {
  type: 'generic';
  actionTypes?: Pf2IconType[];
  category?: string;
  traits?: string[];
  topSections?: GenericSection[];
  middleSections?: GenericSection[];
  bottomSections?: GenericSection[];
  link?: string;
  printHidden?: boolean;
}

export type GenericSectionProperty =
  | 'topSections'
  | 'middleSections'
  | 'bottomSections';

export type GenericSection = {
  label: string;
  content: string;
};

export function isGenericCardDescriptor(entity: Entity): entity is GenericCard {
  return entity.type === 'generic';
}

// export type CardSection = CardDivider | CardText;

// export type CardDivider = {
//   type: 'divider';
// };

// export type CardText = {
//   type: 'text';
//   style?: {
//     fontSize?: string;
//   };
//   text: string;
// };
