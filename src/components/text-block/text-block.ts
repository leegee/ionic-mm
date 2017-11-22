import { Component, ElementRef, Input, AfterViewChecked, EventEmitter, Output } from '@angular/core';

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
  instanceIndex: number;
  public static instanceCount: number = 0;
  private el: any;
  private elRef: ElementRef;
  editing: boolean;
  @Input('text') text: string;
  @Input('id') id: string;
  @Input('clr') clr: string;
  @Input('x') x: any;
  @Input('y') y: any;
  @Output() updated: EventEmitter<TextBlockComponent> = new EventEmitter<TextBlockComponent>();

  constructor(
    elRef: ElementRef
  ) {
    this.elRef = elRef;
    TextBlockComponent.instanceCount++;
    this.instanceIndex = TextBlockComponent.instanceCount - 1;
    this.id = 'text-block-index-' + (TextBlockComponent.instanceCount - 1);
  }

  ngAfterViewChecked() {
    this.el = this.elRef.nativeElement.querySelector('#' + this.id);
    this.position();
  }

  inputBlurred(e) {
    // console.log('here we are', e.value, '===', this.x, this.y, this.clr, this.text, this.id, this.instanceIndex);
    this.updated.emit(this);
    this.editing = false;
  }

  private position() {
    this.el.style.left = this.x;
    this.el.style.top = this.y;
    this.el.style.color = this.clr;
    // console.log('Display ', this.x, this.y);
  }

}


