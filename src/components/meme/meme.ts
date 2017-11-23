import { Shareable } from './../shareable';
import { ElementRef, AfterViewChecked } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TextBlockComponent } from '../text-block/text-block';

export abstract class Meme implements AfterViewChecked {
  static title: string;
  static thumbnailUrl: string;
  imageUrl: string;
  width: number;
  height: number;
  fontFamily: string = 'cursive';
  lineHeight: string = '24pt';
  fontSize: string = '24pt';
  fontWeight: string = 'bolder';
  // static scale: { x: number; y: number; };
  textBlocks: { [key: string]: TextBlockComponent } = {};
  private canvas: HTMLCanvasElement;;

  public constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private elRef: ElementRef
  ) {
    this.elRef = elRef;
  }

  ngAfterViewChecked() {
    var img = this.elRef.nativeElement.querySelector('img');
    var memeContainer = this.elRef.nativeElement.querySelector('.meme-text-container');

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

    memeContainer.style.font = this.fontStyleString();
    memeContainer.style.width = renderedImg.width + 'px';
    memeContainer.style.height = renderedImg.height + 'px';
  }

  fontStyleString() {
      return this.fontWeight + ' '
      + this.fontSize + '/' + this.lineHeight + ' '
      + this.fontFamily;
  }

  updated(textblock: TextBlockComponent) {
    this.textBlocks[textblock.id] = textblock;
    // console.log('updated set ', textblock.id, Object.keys(this.textBlocks).length);
  }

  setAnchor(
    x: number,
    y: number,
    text?: string
  ) {
    // console.log(this);
  }

  share() {
    console.log('Meme.share!', this.textBlocks);
    // let screenshot = new Screenshot(document).getImg();
    let image = this.getFinalImage();
    // Shareable.share(png);
  }

  getFinalImage() {
    let img: HTMLImageElement = new Image(this.width, this.getheight);
    img.src = this.imageUrl;

    this.canvas = document.createElement("canvas");
    this.canvas.id = "screenshot-canvas";
    document.body.appendChild(this.canvas);

    let ctx = this.canvas.getContext("2d");
    ctx.canvas.width = img.width;
    ctx.canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    console.log(this.textBlocks);
    // this.textBlocks.forEach((textBlock) => {
    //   console.log(textBlock.x, textBlock.y, textBlock.text)
    // })

    // let imgExport = new Image(this.width, this.height);
    // imgExport.src = this.canvas.toDataURL();

  }

}
