import { inject } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Routes,
} from '@angular/router';
import { DecksService } from './core';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'decks',
    pathMatch: 'full',
    // loadComponent: async () =>
    //   import('./pages/home/home.component').then((m) => m.HomePage),
  },
  {
    path: 'cards',
    loadComponent: async () =>
      import('./pages/cards/cards.component').then((m) => m.CardsPage),
  },
  {
    path: 'decks',
    loadComponent: async () =>
      import('./pages/decks/decks.component').then((m) => m.DecksPage),
    children: [
      {
        path: ':id',
        loadComponent: async () =>
          import('./pages/deck/deck.component').then((m) => m.DeckPage),
        resolve: {
          deck: (route: ActivatedRouteSnapshot) => {
            const id = route.paramMap.get('id');
            return inject(DecksService).selectById(id!);
          },
        },
      },
    ],
  },
];
