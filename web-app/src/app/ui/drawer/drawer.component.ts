import { Component } from '@angular/core';
import { generateId } from '../../utils/generate-id.util';

@Component({
  selector: 'app-drawer',
  imports: [],
  template: `
    <div class="drawer drawer-open">
      <input [id]="id" type="checkbox" class="drawer-toggle" />
      <div class="drawer-content">
        <ng-content />
        <label
          [for]="id"
          class="btn btn-primary drawer-button lg:hidden print:hidden!"
        >
          Open drawer
        </label>
      </div>
      <div class="drawer-side print:hidden!">
        <label
          [for]="id"
          aria-label="close sidebar"
          class="drawer-overlay"
        ></label>
        <ng-content select="[side]" />
      </div>
    </div>
  `,
  styles: ``,
})
export class Drawer {
  id = generateId('drawer');
}
