import { NavParams, ViewController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { SafeStyle } from '@angular/platform-browser/src/security/dom_sanitization_service';

@Component({
  selector: 'color-picker-popover',
  templateUrl: 'color-picker-popover.html'
})
export class ColorPickerPopoverComponent {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  protected originalStyle: SafeStyle;
  protected chosenAlpha: number = 1;
  private chosenColor: string;
  private red: number;
  private green: number;
  private blue: number;
  private alpha: number;

  constructor(
    private domSanitizer: DomSanitizer,
    public viewCtrl: ViewController,
    public navParams: NavParams
  ) {
    this.originalStyle = this.domSanitizer.bypassSecurityTrustStyle(
      'background-color: ' + navParams.data.color
    );
    this.chosenColor = navParams.data.color;
    [, this.red, this.green, this.blue, , this.alpha] = navParams.data.color.match(
      /^rgba?\(([.\d]+),\s*([.\d]+),\s*([.\d]+)(,\s*([.\d]+)?)?\)$/
    );
    this.chosenAlpha = this.alpha ? (this.alpha * 100) : 100;
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
    return this.domSanitizer.bypassSecurityTrustStyle(
      'background-color: ' + this.chosenColor
    );
  }

  setColor() {
    this.alpha = this.chosenAlpha > 0 ? this.chosenAlpha / 100 : 0;
    this.chosenColor = "rgba(" + this.red + ", " +
      this.green + ", " +
      this.blue + ", " +
      this.alpha +
      ")";
  }

  onClick(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const imageData = this.ctx.getImageData(
      e.clientX - rect.left,
      e.clientY - rect.top,
      1, 1
    );
    this.red = imageData.data[0];
    this.green = imageData.data[1];
    this.blue = imageData.data[2];
    this.setColor();
  }

  onCancel() {
    this.viewCtrl.dismiss({ color: this.originalStyle });
  }

  onOk() {
    this.viewCtrl.dismiss({ color: this.chosenColor });
  }
}
