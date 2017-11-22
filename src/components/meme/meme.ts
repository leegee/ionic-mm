import { Shareable } from './../shareable';
import { ElementRef, AfterViewChecked } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TextBlockComponent } from '../text-block/text-block';

export abstract class Meme implements AfterViewChecked {
  title: string;
  imageUrl: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  fontFamily: 'cursive';
  lineHeight: '24pt';
  fontSize: '18pt';
  fontWeight: 'bolder';
  scale: { x: number; y: number; };
  textBlocks: {[key:string]: TextBlockComponent} = {};
  private canvas: HTMLCanvasElement;;

  public constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private elRef: ElementRef
  ) {
    this.elRef = elRef;
  }

  get(field: string) {
    return Meme[field];
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

    memeContainer.style.width = renderedImg.width + 'px';
    memeContainer.style.height = renderedImg.height + 'px';
  }

  styleString() {
    return 'font:' + this.get('fontFamily') + ' '
      + this.get('fontWeight') + ' '
      + this.get('fontSize') + '/' + + this.get('lineHeight')
  }

  updated(textblock: TextBlockComponent) {
    this.textBlocks[textblock.id] = textblock;
    console.log('updated set ', textblock.id, Object.keys(this.textBlocks).length);
  }

  setAnchor(
    x: number,
    y: number,
    text?: string
  ) {
    console.log(this);
  }

  share() {
    console.log('Meme.Share()');
    // let screenshot = new Screenshot(document).getImg();
    let image = this.getFinalImage();
    // Shareable.share(png);
  }

  getFinalImage() {
    let img: HTMLImageElement = new Image(this.get('width'), this.get('height'));
    img.src = this.get('imageUrl');

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
