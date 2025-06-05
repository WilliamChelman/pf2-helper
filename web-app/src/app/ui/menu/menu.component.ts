import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  contentChildren,
  Directive,
  inject,
  Injectable,
  Input,
  input,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';

@Injectable()
export class MenuService {
  closeOnClick = signal(true);
}

@Component({
  selector: 'app-menu',
  imports: [NgTemplateOutlet, NgClass],
  providers: [MenuService],
  template: `
    <div class="dropdown" [ngClass]="[justify(), align()]">
      <ng-content select="[menuOrigin]" />
      <ul
        [class]="contentClass()"
        class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box"
      >
        @for (menuItem of menuItems(); track menuItem) {
          <ng-container *ngTemplateOutlet="menuItem.tpl()"></ng-container>
        }
      </ul>
    </div>
  `,
  styles: ``,
})
export class Menu {
  @Input()
  set closeOnClick(value: boolean) {
    this.menuService.closeOnClick.set(value);
  }

  menuService = inject(MenuService);
  contentClass = input<string>();
  align = input<'dropdown-end' | 'dropdown-start'>('dropdown-start');
  justify = input<'dropdown-top' | 'dropdown-bottom'>('dropdown-bottom');
  menuItems = contentChildren(MenuItem);
}

@Component({
  selector: 'app-menu-item',
  template: `
    <ng-template #tpl>
      <li (click)="onClick()">
        <ng-content />
      </li>
    </ng-template>
  `,
  standalone: true,
})
export class MenuItem {
  tpl = viewChild<TemplateRef<any>>('tpl');
  #menuService = inject(MenuService);

  // to close the menu
  onClick() {
    if (!this.#menuService.closeOnClick()) return;
    setTimeout(() => {
      (document.activeElement as HTMLElement)?.blur();
    });
  }
}

@Directive({
  selector: '[menuOrigin]',
})
export class MenuOrigin {}
