import {
  Directive,
  ElementRef,
  HostListener,
  Renderer2,
  forwardRef,
  inject,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[appContentEditable]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ContentEditable),
      multi: true,
    },
  ],
  host: {
    class: 'focus-visible:outline-offset-4',
  },
})
export class ContentEditable implements ControlValueAccessor {
  #onChange: (value: string) => void = () => {};
  #onTouched: () => void = () => {};
  #elementRef = inject(ElementRef) as ElementRef<HTMLElement>;
  #renderer = inject(Renderer2);

  @HostListener('input')
  onInput() {
    const value = this.#elementRef.nativeElement.innerHTML;
    this.#onChange(value);
  }

  @HostListener('blur')
  onBlur() {
    this.#onTouched();
  }

  writeValue(value: string): void {
    if (value == null) return;
    const html = this.toHtml(value);

    if (this.#elementRef.nativeElement.innerHTML !== html) {
      this.#renderer.setProperty(
        this.#elementRef.nativeElement,
        'innerHTML',
        html,
      );
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.#onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.#onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.#renderer.removeAttribute(
        this.#elementRef.nativeElement,
        'contenteditable',
      );
    } else {
      this.#renderer.setAttribute(
        this.#elementRef.nativeElement,
        'contenteditable',
        '',
      );
    }
  }

  private toHtml(value: string) {
    return value.replace(
      /\[(.*?)\]/g,
      '<i class="font-pf not-italic">[$1]</i>',
    );
  }
}
