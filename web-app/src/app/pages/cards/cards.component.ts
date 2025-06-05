import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';

import { CardsService } from '@/core';
import { AnyCard } from '@/ui/any-card';
import { Drawer } from '@/ui/drawer';
import { PageContainer } from '@/ui/page-container';

@Component({
  selector: 'app-cards',
  imports: [AnyCard, AsyncPipe, Drawer, PageContainer],
  template: `
    <app-drawer>
      <ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4" side>
        <!-- Sidebar content here -->
        <li><a>Sidebar Item 1</a></li>
        <li><a>Sidebar Item 2</a></li>
      </ul>

      <app-page-container>
        <button
          class="btn btn-primary print:hidden"
          (click)="cardsService.create('actionCard')"
        >
          Add Action Card
        </button>
        <div class="flex gap-3 flex-wrap">
          @for (card of cardsService.list$ | async; track card.id) {
            <app-any-card [cardId]="card.id" />
          }
        </div>
      </app-page-container>
    </app-drawer>
  `,
  styles: ``,
})
export class CardsPage {
  cardsService = inject(CardsService);
}
