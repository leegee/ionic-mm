import { Component, ElementRef, Input } from '@angular/core';
import { AfterViewChecked } from '@angular/core/src/metadata/lifecycle_hooks';
import { TextBlockInterface } from '../text-block-interface';

@Component({
  selector: 'text-block',
  templateUrl: 'text-block.html'
})
export class TextBlockComponent implements TextBlockInterface, AfterViewChecked {
  @Input('text') text: string;
  @Input('clr') clr: string;
  @Input('x') x: any;
  @Input('y') y: any;

  private el: HTMLElement;
  private elRef: ElementRef;
  public editing: boolean = false;
  public placeholder: string = "Your text";

  constructor(elRef: ElementRef) {
    this.elRef = elRef;
  }

  ngAfterViewChecked() {
    this._setPosition();
  }

  getText() {
    return this.text;
  }
  getX() {
    return this.x;
  }
  getY() {
    return this.y;
  }
  getClr() {
    return this.clr;
  }
  getElement() {
    return this.el;
  }

  onVisible() {
    this.editing = true;
    setTimeout(() => {
      var el = this.elRef.nativeElement.querySelector('input');
      el.select();
      el.focus();
    }, 1);
  }

  private _setPosition() {
    this.el = this.el || this.elRef.nativeElement.querySelector('.text-block-container');
    // Eventually move into style.top etc
    this.el.style.left = this.x;
    this.el.style.top = this.y;
    this.el.style.color = this.clr;
  }

}
