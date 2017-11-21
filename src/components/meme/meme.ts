import { ElementRef, AfterViewChecked } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

export abstract class Meme implements AfterViewChecked {
  static title: string;
  static imageUrl: string;
  static thumbnailUrl: string;
  static width: number;
  static height: number;
  private scale: { x: number; y: number; };
  public textBlocks: any = [];

  // public constructor(
    // private  navCtrl: NavController,
    // private  navParams: NavParams,
    // private elRef: ElementRef
  // ) {
    // this.elRef = elRef;
  // }

  get(field: string) {
    return Meme[field];
  }

  ngAfterViewChecked() {
    var img = this.elRef.nativeElement.querySelector('img');
    var memeContainer = this.elRef.nativeElement.querySelector('.meme-container');

    // https://stackoverflow.com/questions/37256745/object-fit-get-resulting-dimensions
    function getRenderedSize(cWidth, cHeight, width, height, pos) {
      var oRatio = width / height,
        cRatio = cWidth / cHeight;
      return function () {
        if (oRatio > cRatio) {
          this.width = cWidth;
          this.height = cWidth / oRatio;
        } else {
          this.width = cHeight * oRatio;
          this.height = cHeight;
        }
        this.left = (cWidth - this.width) * (pos / 100);
        this.right = this.width + this.left;
        return this;
      }.call({});
    }

    function getImgSizeInfo(img) {
      var pos = window.getComputedStyle(img).getPropertyValue('object-position').split(' ');
      return getRenderedSize(
        img.width,
        img.height,
        img.naturalWidth,
        img.naturalHeight,
        parseInt(pos[0]));
    }

    var renderedImg = getImgSizeInfo(img);
    // this.scale = {
    //   x: renderedImg.width / MemedogePage.width,
    //   y: renderedImg.height / MemedogePage.height
    // };

    memeContainer.style.width = renderedImg.width + 'px';
    memeContainer.style.height = renderedImg.height + 'px';
  }

  setAnchor(
    x: number,
    y: number,
    text?: string
  ) {
    console.log(this);
  }

}
