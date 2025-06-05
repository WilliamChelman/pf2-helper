import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './ui/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  template: `
    <app-header class="print:hidden" />
    <main>
      <router-outlet />
    </main>
  `,
  styles: '',
})
export class App {}
