import { Pf2IconType } from '@/core';
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'i[pf2-icon]',
  imports: [],
  template: ` {{ icon() }} `,
  host: {
    class: 'font-pf not-italic',
  },
  styles: ``,
})
export class Pf2Icon {
  type = input<Pf2IconType>();
  icon = computed(() => {
    switch (this.type()) {
      case 'one':
        return '[one-action]';
      case 'two':
        return '[two-actions]';
      case 'three':
        return '[three-actions]';
      case 'reaction':
        return '[reaction]';
      case 'free':
        return '[free-action]';
      default:
        return '?';
    }
  });
}
