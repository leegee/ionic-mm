import { NavParams } from 'ionic-angular';
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
  choosingColor: string;
  originalStyle: SafeStyle;

  constructor(
    private domSanitizer: DomSanitizer,
    public navParams: NavParams
  ) {
    this.originalStyle = this.domSanitizer.bypassSecurityTrustStyle(
      'background-color: ' + navParams.data.color
    );
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

  onClick(e) {
    var rect = this.canvas.getBoundingClientRect();
    const imageData = this.ctx.getImageData(
      e.clientX - rect.left,
      e.clientY - rect.top,
      1,
      1
    );
    this.choosingColor = "rgb(" + imageData.data[0] + ", " + imageData.data[1] + ", " + imageData.data[2] + ")";
  }

  getfontStyleAttr() {
    return this.domSanitizer.bypassSecurityTrustStyle(
      'background-color: ' + this.choosingColor
    );
  }
}
