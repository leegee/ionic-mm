import { Keyboard } from '@ionic-native/keyboard';
import { TextRenderer } from './../text-renderer';
import { Component, ElementRef, Input } from '@angular/core';
import { TextBlockInterface } from '../text-block-interface';

@Component({
  selector: 'text-block',
  templateUrl: 'text-block.html'
})
export class TextBlockComponent extends TextRenderer implements TextBlockInterface {
  @Input('text') text: string;
  @Input('id') id: string;
  isHidden: false;

  private elRef: ElementRef;
  public editing = false;
  public placeholder: string = "Enter your text here";

  constructor(
    private keyboard: Keyboard,
    elRef: ElementRef
  ) {
    super();
    this.elRef = elRef;
  }

  getText(): string {
    return this.text;
  }

  getStyles(): {} {
    return document.defaultView.getComputedStyle(
      this.elRef.nativeElement
      // return this.elRef.nativeElement.querySelector('.text-block-container');
    ) as {};
  }

  onStartEditing() {
    this.editing = true;
    setTimeout(() => {
      var el = this.elRef.nativeElement.querySelector('input');
      el.select();
      el.focus();
      this.keyboard.show();
      // console.log('onTextVisible');
    }, 1);
  }

  onBlur() {
    this.editing = false;
    this.keyboard.close();
    // console.log('onBlur');
  }

  setPosition(){
    throw new Error('Not implemented');
  }

  sizeText(){
    throw new Error('Not implemented');
  }
}
