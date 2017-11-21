import { Component, ElementRef, Input, AfterViewChecked } from '@angular/core';

/**
 * Generated class for the TextBlockComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'text-block',
  templateUrl: 'text-block.html'
})
export class TextBlockComponent implements AfterViewChecked {
  public el: any;
  @Input('text') text: string;
  @Input('id') id: string;
  @Input('x') x: number;
  @Input('y') y: number;

  constructor(
    elRef: ElementRef
  ) {
    this.el = elRef.nativeElement;
  }

  ngAfterViewChecked () {
    this.setPosition(this.x, this.y);
  }

  setPosition(x: number, y: number) {
    this.x = this.el.style.left = x;
    this.y = this.el.style.top = y;
    console.log('set position ', x, y);
  }

  inputText(text: string) {
    this.text = text;
  }

}


