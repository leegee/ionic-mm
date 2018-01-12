import { NavParams } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Component } from '@angular/core';

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
  originalColor: string;

  constructor(
    private domSanitizer: DomSanitizer,
    public navParams: NavParams
  ) {
    this.originalColor = navParams.data.color;
  }

  ngOnInit() {
    this.canvas = document.getElementById('picker') as HTMLCanvasElement;;
    this.ctx = this.canvas.getContext('2d');
    console.log(this.navParams.data.color)
    let image = new Image();
    image.onload = () => {
      this.ctx.drawImage(image, 0, 0, image.width, image.height);
    }
    image.src = 'assets/imgs/colorwheel.png';
  }

  onClick(e) {
    console.log(e.clientX, this.canvas.offsetLeft);
    const imageData = this.ctx.getImageData(
      Math.floor(e.pageX - this.canvas.offsetLeft),
      Math.floor(e.pageY - this.canvas.offsetTop),
      1,
      1
    );
    this.choosingColor = "rgb(" + imageData.data[0] + ", " + imageData.data[1] + ", " + imageData.data[2] + ")";
  }

  getStyleAttr() {
    return this.domSanitizer.bypassSecurityTrustStyle(
      'background-color: ' + this.choosingColor
    );
  }
}
