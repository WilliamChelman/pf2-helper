import { DecksService } from '@/core';
import { CardFormatsService } from '@/core/services/card-formats.service';
import { AnyCard } from '@/ui/any-card';
import { CardAdder } from '@/ui/card-adder/card-adder';
import { ContentEditable } from '@/ui/content-editable';
import { Select } from '@/ui/select/select';
import { entityToSelectOption } from '@/utils';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, of, switchMap } from 'rxjs';
import { DisplayMode } from '@/core/models/display-mode';

@Component({
  selector: 'app-deck',
  imports: [AnyCard, ContentEditable, FormsModule, CardAdder, Select],
  template: `
    @if (deck()) {
      <div class="flex items-center gap-4 print:hidden">
        <h1
          class="text-2xl font-bold flex-grow"
          appContentEditable
          [ngModel]="deck()?.name"
          (ngModelChange)="decksService.changeProperty(deck()!, 'name', $event)"
        ></h1>

        <button
          class="btn btn-ghost btn-sm"
          (click)="duplicateDeck()"
          title="Duplicate deck"
        >
          <i class="bx bx-copy"></i>
        </button>

        <button
          class="btn btn-ghost btn-sm text-error"
          (click)="deleteDeck()"
          title="Delete deck"
        >
          <i class="bx bx-trash"></i>
        </button>
      </div>

      <app-card-adder
        class="block mb-2 print:hidden"
        (cardCreated)="decksService.addToProperty(deck()!, 'cards', $event)"
      />

      <div class="flex gap-4 print:hidden">
        <app-select
          class="flex-1"
          [ngModel]="deck()?.format"
          [options]="formatOptions() ?? []"
          (ngModelChange)="
            decksService.changeProperty(deck()!, 'format', $event)
          "
        />

        <app-select
          class="flex-1"
          [ngModel]="displayMode()"
          [options]="displayModeOptions"
          (ngModelChange)="displayMode.set($event)"
        />
      </div>

      <div
        class="flex gap-x-12 gap-y-3 print:gap-x-3 flex-wrap print:justify-center mt-3 print:mt-0"
      >
        @for (cardId of deck()?.cards; track cardId; let i = $index) {
          <app-any-card
            [displayMode]="displayMode()"
            [format]="format()"
            [cardId]="cardId"
            (removed)="
              decksService.removeFromProperty(deck()!, 'cards', cardId)
            "
            (duplicated)="
              decksService.addToProperty(deck()!, 'cards', $event, i)
            "
          />
        }
      </div>
    }
  `,
})
export class DeckPage {
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  formatOptions = toSignal(
    inject(CardFormatsService).list$.pipe(
      map((list) => list?.map(entityToSelectOption)),
    ),
  );

  decksService = inject(DecksService);
  formatsService = inject(CardFormatsService);
  private deck$ = this.#route.params.pipe(
    map((params) => params['id']),
    switchMap((id) => this.decksService.selectById(id)),
  );
  deck = toSignal(this.deck$);
  format = toSignal(
    this.deck$.pipe(
      map((deck) => deck?.format),
      switchMap((formatId) =>
        formatId ? this.formatsService.selectById(formatId) : of(undefined),
      ),
    ),
  );

  displayMode = signal<DisplayMode>(DisplayMode.front);
  displayModeOptions = [
    { value: DisplayMode.front, label: 'Front' },
    { value: DisplayMode.back, label: 'Back' },
  ];

  async deleteDeck() {
    if (!this.deck()) return;

    if (confirm('Are you sure you want to delete this deck?')) {
      this.decksService.remove(this.deck()!);
      await this.#router.navigate(['/decks']);
    }
  }

  async duplicateDeck() {
    if (!this.deck()) return;

    const newDeckId = this.decksService.duplicate(this.deck()!);
    await this.#router.navigate(['/decks', newDeckId]);
  }
}
