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
    //   import('./pages/home/home').then((m) => m.HomePage),
  },
  {
    path: 'cards',
    loadComponent: async () =>
      import('./pages/cards/cards').then((m) => m.CardsPage),
  },
  {
    path: 'decks',
    loadComponent: async () =>
      import('./pages/decks/decks').then((m) => m.DecksPage),
    children: [
      {
        path: ':id',
        loadComponent: async () =>
          import('./pages/deck/deck').then((m) => m.DeckPage),
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
