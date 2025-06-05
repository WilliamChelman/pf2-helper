import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-page-container',
  imports: [],
  template: `
    <div
      class="container mx-auto p-3 print:p-0 print:flex print:justify-center print:flex-wrap"
    >
      <ng-content />
    </div>
  `,
  styles: ``,
  encapsulation: ViewEncapsulation.None,
})
export class PageContainer {}
