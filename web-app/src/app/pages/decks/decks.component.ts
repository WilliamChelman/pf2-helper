import { DecksService, StateService } from '@/core';
import { DividerComponent } from '@/ui/divider';
import { Drawer } from '@/ui/drawer';
import { PageContainer } from '@/ui/page-container';
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
    DividerComponent,
    Drawer,
    PageContainer,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
  template: `
    <app-drawer>
      <ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4" side>
        @for (deck of decksService.list$ | async; track deck.id) {
          <li>
            <a [routerLink]="deck.id" [routerLinkActive]="['font-bold']">{{
              deck.name
            }}</a>
          </li>
        }

        <app-divider class="my-3 -mx-4" />

        <li>
          <button class="btn btn-primary mb-2" (click)="createDeck()">
            <i class="bx bx-plus"></i>
            Create
          </button>
        </li>
        <li>
          <button class="btn btn-secondary mb-2" (click)="fileInput.click()">
            <i class="bx bx-folder-up-arrow"></i>
            Upload
          </button>
          <input
            #fileInput
            type="file"
            accept=".json"
            class="hidden"
            (change)="onFileSelected($event)"
          />
        </li>
        <li>
          <button class="btn btn-accent mb-2" (click)="downloadAll()">
            <i class="bx bx-folder-down-arrow"></i>
            Download All
          </button>
        </li>
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
  stateService = inject(StateService);
  router = inject(Router);

  createDeck() {
    const id = this.decksService.create('deck');
    this.router.navigate(['/decks', id]);
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      this.stateService.uploadJson(file);
      // Reset the input so the same file can be selected again
      target.value = '';
    }
  }

  downloadAll() {
    this.stateService.downloadAll();
  }
}
