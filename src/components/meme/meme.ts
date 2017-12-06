import { NavController } from 'ionic-angular';
import { Shareable } from './../shareable';
import { ElementRef, AfterViewChecked, QueryList, ViewChildren } from '@angular/core';
import { ContainerSizeService } from '../../services/ContainerSizeService';
import { TextBlockInterface } from '../text-block-interface';

export abstract class Meme implements AfterViewChecked {

  @ViewChildren('textinput') textBlocks: QueryList<TextBlockInterface>;

  static title: string;
  static thumbnailUrl: string;
  private static textStyleRules = ['textAlign', 'color', 'fontSize', 'fontFamily', 'fontWeight', 'lineHeight', 'position', 'left', 'top', 'bottom', 'right'];
  protected container: HTMLElement;
  protected img: HTMLImageElement;
  private shareImg: HTMLImageElement;
  public imageUrl: string;
  public width: number;
  public height: number;
  private containerSize: { [key: string]: number };

  public constructor(
    public navCtrl: NavController,
    protected elRef: ElementRef,
    protected containerSizeService: ContainerSizeService
  ) {
  }

  ngAfterViewChecked() {
    if (!this.img) {
      this.img = this.elRef.nativeElement.querySelector('img');
      this.container = this.elRef.nativeElement.querySelector('#meme-text-container');
    }
    let { width, height } = this.containerSizeService.size(this.img);
    this.containerSize = { width, height };
    this.container.style.width = width + 'px';
    this.container.style.height = height + 'px';
  }

  share() {
    this._createShareImg();
    Shareable.share(this.shareImg);
    // this.navCtrl.pop(); // Back to the home page
  }

  private _getStyles = (textBlock: TextBlockInterface) => {
    let textBlockStyle = Object.assign.apply(Object, [
      {},
      document.defaultView.getComputedStyle(this.container),
      document.defaultView.getComputedStyle(textBlock.getStyledParentElement()),
      document.defaultView.getComputedStyle(textBlock.getStyledElement()),
    ]);

    // console.log('parent', textBlock.getStyledParentElement());
    // console.log('child', textBlock.getStyledElement());

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

  private _scaleImgSide(cssValue: string, side: string) {
    let rv;
    let [, previewLiteral, type] = cssValue.match(/^([.\d]+)\s*([%\w]+)?/);
    if (type === 'px') {
      rv = Number(previewLiteral) * (this.shareImg[side] / this.containerSize[side]);
      console.log(this[side], this.shareImg[side], previewLiteral, rv);
    } else {
      // if (type === '%') rv = Number(previewLiteral) * (this.img[side] / 100);
      console.error('Now only expecting px');
      debugger;
    }
    // console.log( '--------------', side,':', this.containerSize[side],' v ', this.shareImg[side], ' = ', previewLiteral, 'v', rv);
    return rv;
  }

  private _scaleFont(cssValue: string) {
    return this._scaleImgSide(cssValue, 'width') + 'px';
  }

  private _createShareImg() {
    this.shareImg = new Image(
      this.img.naturalWidth, this.img.naturalHeight
    );
    this.shareImg.src = this.img.src;

    let canvas = document.createElement("canvas");
    canvas.id = "screenshot-canvas";
    document.body.appendChild(canvas);

    let ctx = canvas.getContext("2d");
    ctx.canvas.width = this.shareImg.width;
    ctx.canvas.height = this.shareImg.height;
    ctx.drawImage(this.shareImg, 0, 0);

    this.textBlocks.forEach((textBlock) => {
      let blockStyles: { [key: string]: string } = this._getStyles(textBlock);
      ctx.font = [
        blockStyles.fontWeight || '',
        this._scaleFont(blockStyles.fontSize) || '',
        blockStyles.fontFamily || ''
      ].join(' ');

      if (blockStyles.textAlign) {
        ctx.textAlign = blockStyles.textAlign;
      }
      ctx.textBaseline = 'middle';
      ctx.fillStyle = blockStyles.color;
      ctx.fillText(
        textBlock.getText(),
        this._scaleImgSide(blockStyles.left, 'width'),
        this._scaleImgSide(blockStyles.top, 'height')
      );
    });

    let imgExport = new Image(this.width, this.height);
    imgExport.src = canvas.toDataURL();
    window.open().document.body.appendChild(imgExport);;

    var imgB64 = canvas.toDataURL();
    canvas.outerHTML = '';
    return imgB64;
  }

}
