import {
  Directive,
  ElementRef,
  OnInit,
  OnDestroy,
  Input,
  NgZone,
} from '@angular/core';

@Directive({
  selector: '[appAutoSizeFont]',
  standalone: true,
})
export class AutoSizeFont implements OnInit, OnDestroy {
  @Input() minFontSize = 8;
  @Input() maxFontSize = 100;
  @Input() step = 1;
  @Input() overflowThreshold = 0; // pixels of allowed overflow

  private observer!: MutationObserver;
  private originalFontSize!: string;
  private resizeTimeout: any;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit() {
    // Store original font size
    this.originalFontSize = window.getComputedStyle(
      this.el.nativeElement,
    ).fontSize;

    // Setup mutation observer
    this.observer = new MutationObserver(() => {
      // Debounce resize calculations
      if (this.resizeTimeout) {
        clearTimeout(this.resizeTimeout);
      }

      this.resizeTimeout = setTimeout(() => {
        this.adjustFontSize();
      }, 100);
    });

    // Start observing
    this.observer.observe(this.el.nativeElement, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
    });

    // Initial adjustment
    this.adjustFontSize();
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    // Restore original font size
    this.el.nativeElement.style.fontSize = this.originalFontSize;
  }

  private adjustFontSize() {
    const element = this.el.nativeElement;
    const parent = element.parentElement;

    if (!parent) return;

    // Reset to max font size to start binary search
    element.style.fontSize = `${this.maxFontSize}px`;

    // Binary search for optimal font size
    let low = this.minFontSize;
    let high = this.maxFontSize;
    let optimalSize = this.maxFontSize;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      element.style.fontSize = `${mid}px`;

      if (this.isOverflowing(element, parent)) {
        high = mid - this.step;
      } else {
        optimalSize = mid;
        low = mid + this.step;
      }
    }

    // Apply the optimal size
    element.style.fontSize = `${optimalSize}px`;
  }

  private isOverflowing(element: HTMLElement, parent: HTMLElement): boolean {
    const elementRect = element.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();

    const horizontalOverflow = elementRect.width - parentRect.width;
    const verticalOverflow = elementRect.height - parentRect.height;

    return (
      horizontalOverflow > this.overflowThreshold ||
      verticalOverflow > this.overflowThreshold
    );
  }
}
