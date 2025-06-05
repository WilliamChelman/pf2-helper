import { BehaviorSubject, map, Observable } from 'rxjs';
import { Entity } from '../models/entity.model';
import { Many, manyToArray } from '../models';

export abstract class EntityService<T extends Entity> {
  protected abstract getStorageKey(): string;

  private count = 0;
  private entitiesSubject = new BehaviorSubject<T[]>(this.loadFromStorage());
  protected getDefaultEntities(): T[] {
    return [];
  }
  list$: Observable<T[]> = this.entitiesSubject.asObservable();

  getListSnapshot(): T[] {
    return this.entitiesSubject.value;
  }

  private loadFromStorage(): T[] {
    const stored = localStorage.getItem(this.getStorageKey());
    return stored ? JSON.parse(stored) : this.getDefaultEntities();
  }

  private saveToStorage(): void {
    localStorage.setItem(
      this.getStorageKey(),
      JSON.stringify(this.entitiesSubject.value),
    );
  }

  createEntityShell(type: string): T {
    const entity = {
      id: crypto.randomUUID(),
      type,
      name: `New ${type}`,
    } as T;
    return entity;
  }

  create(type: string): string {
    const entity = this.createEntityShell(type);
    this.add(entity);
    return entity.id;
  }

  add(entity: Many<T>, checkOverrides?: boolean): void {
    let currentEntities = this.entitiesSubject.value;
    const newEntities = manyToArray(entity);
    if (checkOverrides) {
      currentEntities = currentEntities.filter(
        (c) => !newEntities.some((n) => n.id === c.id),
      );
    }
    this.entitiesSubject.next([...currentEntities, ...manyToArray(entity)]);
    this.saveToStorage();
  }

  changeProperty<U extends T, K extends keyof U>(
    entity: U,
    property: K,
    value: U[K],
    index?: number,
  ): void {
    if (index == null) {
      const next = { ...entity, [property]: value };
      this.update(next);
      return;
    }

    const current = entity[property] ?? ([] as any);
    const next = {
      ...entity,
      [property]: [
        ...current.slice(0, index),
        value,
        ...current.slice(index + 1),
      ],
    };
    this.update(next);
  }

  addToProperty<U extends T, K extends keyof U>(
    entity: U,
    property: K,
    value: any,
    index?: number,
  ): void {
    const current = entity[property] ?? ([] as any);
    if (index == null) {
      const next = { ...entity, [property]: [...current, value] };
      this.update(next);
      return;
    }
    const next = {
      ...entity,
      [property]: [...current.slice(0, index), value, ...current.slice(index)],
    };
    this.update(next);
  }

  removeFromProperty<U extends T, K extends keyof U>(
    entity: U,
    property: K,
    value: any,
  ): void {
    const current = entity[property] ?? ([] as any);
    const next = {
      ...entity,
      [property]: current.filter((v: any) => v !== value),
    };
    this.update(next);
  }

  removeFromPropertyAt<U extends T, K extends keyof U>(
    entity: U,
    property: K,
    index: number,
  ): void {
    const current = (entity[property] ?? []) as unknown[];
    const next = {
      ...entity,
      [property]: current.filter((v, i) => i !== index),
    };
    this.update(next);
  }

  duplicate(entity: T): string {
    const currentEntities = this.entitiesSubject.value;
    const index = currentEntities.findIndex((c) => c.id === entity.id);
    const duplicatedEntity = { ...entity, id: crypto.randomUUID() };
    const newEntities = [
      ...currentEntities.slice(0, index + 1),
      duplicatedEntity,
      ...currentEntities.slice(index + 1),
    ];
    this.entitiesSubject.next(newEntities);
    this.saveToStorage();
    return duplicatedEntity.id;
  }

  remove(entity: T | string): void {
    this.entitiesSubject.next(
      this.entitiesSubject.value.filter((c) => c !== entity),
    );
    this.saveToStorage();
  }

  removeProperty<U extends T, K extends keyof U>(entity: U, property: K): void {
    const next = { ...entity, [property]: undefined };
    this.update(next);
  }

  update(entity: T): void {
    const curr = this.entitiesSubject.value;
    const next = curr.map((c) => (c.id === entity.id ? entity : c));
    this.entitiesSubject.next(next);
    this.saveToStorage();
  }

  clear(): void {
    this.entitiesSubject.next([]);
    this.saveToStorage();
  }

  selectById(id: string): Observable<T | undefined> {
    return this.list$.pipe(
      map((entities) => entities.find((c) => c.id === id)),
    );
  }

  getById(id: string): T | undefined {
    return this.getListSnapshot().find((c) => c.id === id);
  }
}
