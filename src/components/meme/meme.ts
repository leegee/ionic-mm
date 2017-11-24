import { Shareable } from './../shareable';
import { ElementRef, AfterViewChecked } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TextBlockComponent } from '../text-block/text-block';

export abstract class Meme implements AfterViewChecked {
  static title: string;
  static thumbnailUrl: string;
  private static textStyleRules = ['textAlign', 'color', 'fontSize', 'fontFamily', 'fontWeight', 'lineHeight'];
  private container: HTMLElement;
  private img: HTMLImageElement;
  imageUrl: string;
  width: number;
  height: number;
  textBlocks: { [key: string]: TextBlockComponent } = {};

  public constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private elRef: ElementRef
  ) {
    this.elRef = elRef;
  }

  ngAfterViewChecked() {
    this.img = this.elRef.nativeElement.querySelector('img');
    this.container = this.elRef.nativeElement.querySelector('#meme-text-container');

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

    let renderedImg = getImgSizeInfo(this.img);
    // this.scale = {
    //   x: renderedImg.width / DogePage.width,
    //   y: renderedImg.height / DogePage.height
    // };

    this.container.style.width = renderedImg.width + 'px';
    this.container.style.height = renderedImg.height + 'px';
  }

  updated(textblock: TextBlockComponent) {
    this.textBlocks[textblock.id] = textblock;
  }

  share() {
    let img = this.base64memeImage();
    Shareable.share(img);
  }

  // getStyles() {
  //   return this.fontWeight + ' '
  //     + this.fontSize + '/' + this.lineHeight + ' '
  //     + this.fontFamily;
  // }

  base64memeImage() {
    let img: HTMLImageElement = new Image(this.width, this.height);
    img.src = this.img.src;

    let getStyles = (textBlock) => {
      let textBlockStyle = Object.assign(
        {},
        document.defaultView.getComputedStyle(this.container),
        document.defaultView.getComputedStyle(textBlock.el),
      );
      let rv = Object.keys(textBlockStyle)
        .filter(ruleName => Meme.textStyleRules.some(
          wanted => ruleName === wanted && textBlockStyle[ruleName] !== ''
        )
        ).reduce((styles, ruleName) => {
          styles[ruleName] = textBlockStyle[ruleName];
          return styles;
        }, {}
        );
      return rv;
    };

    function literal(pc, xy) {
      let integer = pc.match(/^(\d+)/)[1];
      return integer * (xy / 100);
    }

    let canvas = document.createElement("canvas");
    canvas.id = "screenshot-canvas";
    document.body.appendChild(canvas);

    let ctx = canvas.getContext("2d");
    ctx.canvas.width = img.width;
    ctx.canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    for (let id in this.textBlocks) {
      let blockStyles: { [key: string]: string } = getStyles(this.textBlocks[id]);
      ctx.font = [
        blockStyles.fontWeight || '',
        blockStyles.fontSize || '',
        blockStyles.fontFamily || ''
      ].join(' ');

      console.log('FONT=',ctx.font);

      if (blockStyles.textAlign) {
        ctx.textAlign = blockStyles.textAlign;
      }
      ctx.textBaseline = 'middle';

      ctx.fillStyle = this.textBlocks[id].clr;
      ctx.fillText(
        this.textBlocks[id].text,
        literal(this.textBlocks[id].x, img.width),
        literal(this.textBlocks[id].y, img.height)
      );
    }

    let imgExport = new Image(this.width, this.height);
    imgExport.src = canvas.toDataURL();
    window.open().document.body.appendChild(imgExport);;

    var imgB64 = canvas.toDataURL();
    canvas.outerHTML = '';
    return imgB64;
  }

}
