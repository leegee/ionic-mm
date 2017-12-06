import { Component, ElementRef, Input } from '@angular/core';
import { TextBlockInterface } from '../text-block-interface';

@Component({
  selector: 'text-block',
  templateUrl: 'text-block.html'
})
export class TextBlockComponent implements TextBlockInterface {
  @Input('text') text: string;

  private el: HTMLElement;
  private elRef: ElementRef;
  public editing: boolean = false;
  public placeholder: string = "Your text";

  constructor(elRef: ElementRef) {
    this.elRef = elRef;
  }

  getText() {
    return this.text;
  }

  getStyledElement() {
    return this.elRef.nativeElement; // .querySelector('.display');
  }

  getStyledParentElement() {
    return this.elRef.nativeElement.querySelector('.text-block-container');
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
