import { AutoSizeFont } from './auto-size-font.util';
import { ElementRef } from '@angular/core';

describe('AutoSizeFont', () => {
  it('should create an instance', () => {
    const mockElementRef = {
      nativeElement: document.createElement('div'),
    } as ElementRef<HTMLElement>;
    const directive = new AutoSizeFont(mockElementRef);
    expect(directive).toBeTruthy();
  });
});
