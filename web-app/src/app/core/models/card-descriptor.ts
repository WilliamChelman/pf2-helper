import { Entity } from './entity';
import { Pf2IconType } from './pf2-icon-type';

export interface CardDescriptor extends Entity {
  fontSize?: number;
}

export interface GenericCardDescriptor extends CardDescriptor {
  type: 'generic';
  actionTypes?: Pf2IconType[];
  category?: string;
  traits?: string[];
  topSections?: GenericSection[];
  middleSections?: GenericSection[];
  bottomSections?: GenericSection[];
  link?: string;
}

export type GenericSectionProperty =
  | 'topSections'
  | 'middleSections'
  | 'bottomSections';

export type GenericSection = {
  label: string;
  content: string;
};

export function isGenericCardDescriptor(
  entity: Entity,
): entity is GenericCardDescriptor {
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
