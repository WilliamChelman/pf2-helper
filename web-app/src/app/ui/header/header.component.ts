import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  template: `
    <div class="navbar bg-base-100 shadow-sm">
      <a class="btn btn-ghost text-xl" routerLink="/">Pf2 Helper</a>
      <nav>
        <ul class="menu menu-horizontal bg-base-200 rounded-box">
          @for (link of links; track link.path) {
            <li>
              <a [routerLink]="link.path">{{ link.label }}</a>
            </li>
          }
        </ul>
      </nav>
    </div>
  `,
  styles: ``,
})
export class Header {
  links = [
    // {
    //   label: 'Cards',
    //   path: '/cards',
    // },
    {
      label: 'Decks',
      path: '/decks',
    },
  ];
}
