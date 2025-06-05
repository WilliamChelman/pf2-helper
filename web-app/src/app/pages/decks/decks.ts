import { DecksService } from '@/core';
import { Drawer } from '@/ui/drawer/drawer';
import { PageContainer } from '@/ui/page-container/page-container';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';

@Component({
  selector: 'app-decks',
  imports: [
    AsyncPipe,
    Drawer,
    PageContainer,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  template: `
    <app-drawer>
      <ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4" side>
        <li>
          <button class="btn btn-primary mb-2" (click)="createDeck()">
            <i class="bx bx-plus"></i>
            Create
          </button>
        </li>
        @for (deck of decksService.list$ | async; track deck.id) {
          <li>
            <a [routerLink]="deck.id" [routerLinkActive]="['font-bold']">{{
              deck.name
            }}</a>
          </li>
        }
      </ul>

      <app-page-container>
        <router-outlet />
      </app-page-container>
    </app-drawer>
  `,
  styles: ``,
})
export class DecksPage {
  decksService = inject(DecksService);
  router = inject(Router);

  createDeck() {
    const id = this.decksService.create('deck');
    this.router.navigate(['/decks', id]);
  }
}
