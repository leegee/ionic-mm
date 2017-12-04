import { Component, ElementRef, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'text-block',
  templateUrl: 'text-block.html'
})
export class TextBlockComponent {
  @Input('text') text: string;
  @Input('id') id: string;
  @Input('clr') clr: string;
  @Input('x') x: any;
  @Input('y') y: any;
  @Output() updated: EventEmitter<TextBlockComponent> = new EventEmitter<TextBlockComponent>();

  private el: any;
  private elRef: ElementRef;
  public editing: boolean;

  constructor(elRef: ElementRef) {
    this.elRef = elRef;
  }

  ngDoCheck() {
    // Can only set an ID when we have the necessary data from the template
    if (this.id === undefined) {
      this.id = 'text-block-' + new Date().getTime(); // + Math.random().toString().substring(0,2);
    }
  }

  ngAfterViewChecked() {
    // Can ony get an element when its ID has been composed
    if (!this.el) {
      this.el = this.elRef.nativeElement.querySelector('#' + this.id);
    }
    this.position();
  }

  onActivated() {
    this.editing = true;
    setTimeout(() => {
      var el = this.elRef.nativeElement.querySelector('input');
      el.select();
      el.focus();
    }, 1);
  }

  onUpdated() {
   // The blur event is missing in Ionic since at least July 2017
    // TODO Don't blur if user touched the input box
    this.updated.emit(this);
    this.editing = false;
  }

  private position() {
    this.el.style.left = this.x;
    this.el.style.top = this.y;
    this.el.style.color = this.clr;
    this.updated.emit(this);
  }

}


