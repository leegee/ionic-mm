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
  private elRef: ElementRef;
  public editing: boolean;
  public static instanceCount: number = 0;
  @Input('text') text: string;
  @Input('id') id: string;
  @Input('clr') clr: string;
  @Input('x') x: any;
  @Input('y') y: any;

  constructor(
    elRef: ElementRef
  ) {
    this.elRef = elRef;
    this.id = 'text-block-' + (TextBlockComponent.instanceCount ++);
  }

  ngAfterViewChecked () {
    this.el = this.elRef.nativeElement.querySelector('#' + this.id);
    this.display();
  }

  display() {
    this.el.style.left = this.x;
    this.el.style.top = this.y;
    this.el.style.color = this.clr;
    console.log('Display ', this.x, this.y);
  }

  inputText(text: string) {
    this.text = text;
  }

}


