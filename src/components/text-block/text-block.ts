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
  private  el: any;
  public editing: boolean;
  @Input('text') text: string;
  @Input('id') id: string;
  @Input('x') x: any;
  @Input('y') y: any;

  constructor(
    elRef: ElementRef
  ) {
    this.el = elRef.nativeElement;
  }

  ngAfterViewChecked () {
    this.setPosition(this.x, this.y);
  }

  setPosition(x: number, y: number) {
    this.el.style.left = x + '%';
    this.el.style.top = y + '%';
    console.log('set position ', this.el.style.left, this.el.style.top);
  }

  inputText(text: string) {
    this.text = text;
  }

}


