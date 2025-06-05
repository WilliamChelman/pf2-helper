import {
  Component,
  Input,
  signal,
  inject,
  OnInit,
  effect,
} from '@angular/core';
import { CardsBackgroundService } from './cards-background.service';
import { NgClass } from '@angular/common';

export type ColorScheme =
  | 'default'
  | 'forest'
  | 'ocean'
  | 'sunset'
  | 'purple'
  | 'warm';

interface ColorSchemeConfig {
  radial1: string;
  radial2: string;
  linear1: string;
  linear2: string;
}

@Component({
  selector: 'app-cards-background',
  imports: [NgClass],
  template: ` <div [ngClass]="'is-' + currentScheme()"></div> `,
  styles: `
    div {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      background:
        radial-gradient(
          circle at 25% 25%,
          var(--radial1-color, rgba(139, 69, 19, 0.1)) 0%,
          transparent 50%
        ),
        radial-gradient(
          circle at 75% 75%,
          var(--radial2-color, rgba(160, 82, 45, 0.1)) 0%,
          transparent 50%
        ),
        linear-gradient(
          45deg,
          var(--linear1-color, rgba(34, 139, 34, 0.05)) 25%,
          transparent 25%,
          transparent 75%,
          var(--linear1-color, rgba(34, 139, 34, 0.05)) 75%
        ),
        linear-gradient(
          45deg,
          transparent 25%,
          var(--linear2-color, rgba(139, 69, 19, 0.05)) 25%,
          var(--linear2-color, rgba(139, 69, 19, 0.05)) 75%,
          transparent 75%
        );
      background-size:
        200px 200px,
        200px 200px,
        100px 100px,
        100px 100px;
      background-position:
        0 0,
        100px 100px,
        0 0,
        50px 50px;
    }

    /* Default color scheme */
    .is-default {
      --radial1-color: rgba(139, 69, 19, 0.1);
      --radial2-color: rgba(160, 82, 45, 0.1);
      --linear1-color: rgba(34, 139, 34, 0.05);
      --linear2-color: rgba(139, 69, 19, 0.05);
    }

    /* Forest color scheme */
    .is-forest {
      --radial1-color: rgba(34, 139, 34, 0.15);
      --radial2-color: rgba(85, 107, 47, 0.1);
      --linear1-color: rgba(0, 100, 0, 0.08);
      --linear2-color: rgba(34, 139, 34, 0.06);
    }

    /* Ocean color scheme */
    .is-ocean {
      --radial1-color: rgba(70, 130, 180, 0.12);
      --radial2-color: rgba(0, 191, 255, 0.1);
      --linear1-color: rgba(25, 25, 112, 0.06);
      --linear2-color: rgba(70, 130, 180, 0.05);
    }

    /* Sunset color scheme */
    .is-sunset {
      --radial1-color: rgba(255, 140, 0, 0.12);
      --radial2-color: rgba(255, 69, 0, 0.1);
      --linear1-color: rgba(255, 215, 0, 0.06);
      --linear2-color: rgba(255, 140, 0, 0.05);
    }

    /* Purple color scheme */
    .is-purple {
      --radial1-color: rgba(138, 43, 226, 0.12);
      --radial2-color: rgba(75, 0, 130, 0.1);
      --linear1-color: rgba(147, 112, 219, 0.06);
      --linear2-color: rgba(138, 43, 226, 0.05);
    }

    /* Warm color scheme */
    .is-warm {
      --radial1-color: rgba(210, 105, 30, 0.12);
      --radial2-color: rgba(255, 165, 0, 0.1);
      --linear1-color: rgba(255, 140, 0, 0.06);
      --linear2-color: rgba(210, 105, 30, 0.05);
    }
  `,
})
export class CardsBackgroundComponent implements OnInit {
  private backgroundService = inject(CardsBackgroundService, {
    optional: true,
  });

  @Input({ required: false }) set colorScheme(value: ColorScheme) {
    this.currentScheme.set(value || 'default');
  }

  @Input({ required: false }) useService = false;

  currentScheme = signal<ColorScheme>('default');

  constructor() {
    // Effect to watch service changes when useService is true
    effect(() => {
      if (this.useService && this.backgroundService) {
        const serviceScheme = this.backgroundService.getCurrentScheme();
        this.currentScheme.set(serviceScheme());
      }
    });
  }

  ngOnInit() {
    // Initialize with service value if using service
    if (this.useService && this.backgroundService) {
      const serviceScheme = this.backgroundService.getCurrentScheme();
      this.currentScheme.set(serviceScheme());
    }
  }
}
