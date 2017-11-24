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
    let img = this.elRef.nativeElement.querySelector('img');
    let memeContainer = this.elRef.nativeElement.querySelector('#meme-text-container');

    // https://stackoverflow.com/questions/37256745/object-fit-get-resulting-dimensions
    function getRenderedSize(cWidth, cHeight, width, height, pos) {
      let oRatio = width / height,
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
      let pos = window.getComputedStyle(img).getPropertyValue('object-position').split(' ');
      return getRenderedSize(
        img.width,
        img.height,
        img.naturalWidth,
        img.naturalHeight,
        parseInt(pos[0]));
    }

    let renderedImg = getImgSizeInfo(img);
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
  }

  share() {
    let img = this.base64memeImage();
    Shareable.share(img);
  }

  base64memeImage() {
    let img: HTMLImageElement = new Image(this.width, this.height);
    img.src = this.imageUrl;

    let style = this.elRef.nativeElement.style;
    console.log(style);

    function literal(pc, xy) {
      let l = pc.match(/^(\d+)/)[1];
      return l * (xy / 100);
    }

    this.canvas = document.createElement("canvas");
    this.canvas.id = "screenshot-canvas";
    document.body.appendChild(this.canvas);

    let ctx = this.canvas.getContext("2d");
    ctx.canvas.width = img.width;
    ctx.canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    for (let id in this.textBlocks) {
      ctx.font = this.fontStyleString();
      ctx.fillStyle = this.textBlocks[id].clr;
      ctx.fillText(
        this.textBlocks[id].text,
        literal(this.textBlocks[id].x, img.width),
        literal(this.textBlocks[id].y, img.height)
      );
    }

    // let imgExport = new Image(this.width, this.height);
    // imgExport.src = this.canvas.toDataURL();
    // window.open().document.body.appendChild(imgExport);;
    return this.canvas.toDataURL();
  }

}
