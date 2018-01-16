import { NavParams, ViewController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { SafeStyle } from '@angular/platform-browser/src/security/dom_sanitization_service';

/**
 * Generated class for the ColorPickerPopoverComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'color-picker-popover',
  templateUrl: 'color-picker-popover.html'
})
export class ColorPickerPopoverComponent {
  text: string;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  originalStyle: SafeStyle;
  chosenColor: string;
  r: number;
  g: number;
  b: number;
  chosenOpacity: number = 1;
  opacity: number;

  constructor(
    private domSanitizer: DomSanitizer,
    public viewCtrl: ViewController,
    public navParams: NavParams
  ) {
    this.originalStyle = this.domSanitizer.bypassSecurityTrustStyle(
      'background-color: ' + navParams.data.color
    );
    this.chosenColor = navParams.data.color;
    [, this.r, this.g, this.b, , this.opacity] = navParams.data.color.match(
      /^rgba?\(([.\d]+),\s*([.\d]+),\s*([.\d]+)(,\s*([.\d]+)?)?\)$/
    );
    this.chosenOpacity = this.opacity ? (this.opacity * 100) : 100;
  }

  ngOnInit() {
    this.canvas = document.getElementById('picker') as HTMLCanvasElement;;
    this.ctx = this.canvas.getContext('2d');
    let image = new Image();
    image.onload = () => {
      this.ctx.drawImage(image, 0, 0, image.width, image.height);
    }
    image.src = 'assets/imgs/colorwheel.png';
  }

  getStyleAttr() {
    console.log('this.chosenColor', this.chosenColor);
    return this.domSanitizer.bypassSecurityTrustStyle(
      'background-color: ' + this.chosenColor
    );
  }

  setColor() {
    this.opacity = this.chosenOpacity > 0 ? this.chosenOpacity / 100 : 0;
    this.chosenColor = "rgba(" + this.r + ", " +
      this.g + ", " +
      this.b + ", " +
      this.opacity
    ")";
  }

  onClick(e) {
    var rect = this.canvas.getBoundingClientRect();
    const imageData = this.ctx.getImageData(
      e.clientX - rect.left,
      e.clientY - rect.top,
      1, 1
    );
    this.r = imageData.data[0];
    this.g = imageData.data[1];
    this.b = imageData.data[2];
    this.setColor();
  }

  onCancel() {
    this.viewCtrl.dismiss();
  }

  onOk() {
    this.viewCtrl.dismiss({ color: this.chosenColor });
  }
}
