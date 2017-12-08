import { TextRenderer } from './../text-renderer';
import { Component, ElementRef, Input } from '@angular/core';
import { TextBlockInterface } from '../text-block-interface';

@Component({
  selector: 'text-block',
  templateUrl: 'text-block.html'
})
export class TextBlockComponent extends TextRenderer implements TextBlockInterface  {
  @Input('text') text: string;

  private el: HTMLElement;
  private elRef: ElementRef;
  public editing: boolean = false;
  public placeholder: string = "Your text";

  constructor(elRef: ElementRef) {
    super();
    this.elRef = elRef;
  }

  getText() : string {
    return this.text;
  }

  getStyles() : {} {
    return document.defaultView.getComputedStyle(
      this.elRef.nativeElement
      // return this.elRef.nativeElement.querySelector('.text-block-container');
    ) as {};
  }

  onVisible() {
    this.editing = true;
    setTimeout(() => {
      var el = this.elRef.nativeElement.querySelector('input');
      el.select();
      el.focus();
    }, 1);
  }

}
