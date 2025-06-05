import { Entity } from '@/core';
import { SelectOption } from '@/core/models';

export function entityToSelectOption<T extends Entity>(
  entity: T,
): SelectOption<string> {
  return {
    label: entity.name,
    value: entity.id,
  };
}
