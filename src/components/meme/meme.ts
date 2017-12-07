import { NavController, AlertController, Platform } from 'ionic-angular';
import { Shareable } from './../shareable';
import { ElementRef, AfterViewChecked, QueryList, ViewChildren } from '@angular/core';
import { ContainerSizeService } from '../../services/ContainerSizeService';
import { TextBlockInterface } from '../text-block-interface';

export abstract class Meme implements AfterViewChecked {

  @ViewChildren('textinput') textBlocks: QueryList<TextBlockInterface>;
  static title: string;
  static thumbnailUrl: string;
  static reFontSize = /^([.\d]+)\s*([%\w]+)?/;

  private static textStyleRules = ['textAlign', 'color', 'fontSize', 'fontFamily', 'fontWeight', 'lineHeight', 'position', 'left', 'top', 'bottom', 'right'];
  protected container: HTMLElement;
  protected img: HTMLImageElement;
  private shareImg: HTMLImageElement;
  public imageUrl: string;
  public width: number;
  public height: number;
  private containerSize: { [key: string]: number };
  protected isWeb: boolean;
  private platform: Platform;
  protected alertCtrl: AlertController;

  public constructor(
    public navCtrl: NavController,
    protected elRef: ElementRef,
    protected containerSizeService: ContainerSizeService
  ) {
    this.isWeb = !new Platform().is('android');
    // this.alertCtrl = new AlertController;
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

  ionViewWillLeave() {
    console.log('will leave');
    return false;
  }

  ionViewCanLeave(): boolean {
    let alert = this.alertCtrl.create({
      title: 'Are you sure?',
      message: 'If you leave now, your meme will be lost.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Leave',
          handler: () => {
            console.log('Leave clicked');
            alert.dismiss().then(() => {
              this.navCtrl.pop();
            });
          }
        }
      ]
    });
    alert.present();
    return false;
  }

  share(goBack: boolean = true) {
    this._createShareImg();
    Shareable.share(this.shareImg);
    if (goBack) {
      this.navCtrl.pop();
    }
  }

  private _getStyles = (textBlock: TextBlockInterface) => {
    let textBlockStyle = textBlock.getStyles();
    return Object.keys(textBlockStyle)
      .filter(ruleName => Meme.textStyleRules.some(
        wanted => ruleName === wanted && textBlockStyle[ruleName] !== ''
      )
      ).reduce((styles, ruleName) => {
        styles[ruleName] = textBlockStyle[ruleName];
        return styles;
      }, {}
      );
  };

  private _scaleImgSide(cssValue: string, side: string): number {
    let rv, value, units;
    if (cssValue.match(/^(auto|normal)$/)) {
      rv = 0; // this.shareImg[side];
    } else {
      console.log('check ', cssValue);
      [, value, units] = cssValue.match(Meme.reFontSize);
      if (units === 'px') {
        rv = Number(value) * (this.shareImg[side] / this.containerSize[side]);
      } else {
        console.error('Now only expecting px, got [%s]', units);
        console.trace();
        debugger;
      }
    }
    console.log(side, ':', this.containerSize[side], ' v ', this.shareImg[side], ' = ', cssValue, value, 'v (rv)', rv);
    return rv;
  }

  private _scaleFont(cssValue: string): number {
    console.info('FONT ', cssValue);
    return this._scaleImgSide(cssValue, 'height');
  }

  private _createShareImg() {
    console.log('Share ', this.textBlocks);
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
      let fontSize = this._scaleFont(blockStyles.fontSize);
      ctx.font = [
        blockStyles.fontWeight || '',
        fontSize + 'px',
        blockStyles.fontFamily || ''
      ].join(' ');

      if (blockStyles.textAlign) {
        ctx.textAlign = blockStyles.textAlign;
      }

      ctx.textBaseline = 'top';
      ctx.fillStyle = blockStyles.color;

      this._renderLines(ctx, textBlock.getText(), fontSize,  blockStyles);
    });

    let imgExport = new Image(this.width, this.height);
    imgExport.src = canvas.toDataURL();

    if (this.isWeb) {
      window.open().document.body.appendChild(imgExport);;
    }

    var imgB64 = canvas.toDataURL();
    canvas.outerHTML = '';
    return imgB64;
  }


  private _renderLines(ctx, textToRender, fontSize, blockStyles) {
    let stroke = false;
    if (blockStyles['-webkit-text-stroke-color']
      && blockStyles['-webkit-text-stroke-width']
      && Number(blockStyles['-webkit-text-stroke-width']) > 0
    ) {
      ctx.lineWidth = Number(blockStyles['-webkit-text-stroke-width']);
      ctx.strokeStyle = blockStyles['-webkit-text-stroke-color'];
      stroke = true;
    }

    let lineHeight =  this._getScaledLineHeight( blockStyles, fontSize );

    let x = this._scaleImgSide(blockStyles.left, 'width');
    let y = this._scaleImgSide(blockStyles.top, 'height');

    textToRender.split(/[\n\r\f]/g).forEach((text) => {
      console.info('[%s] at %s, %s', text, x, y);
      ctx.fillText(text, x, y);
      if (stroke) {
        ctx.strokeText(text, x, y);
      }
      y += lineHeight;
    });
  }

  // The computed value of 'line-height' varies by user-agent :(
  private _getScaledLineHeight(blockStyles, scaledFontSize): number {
    let el = document.createElement('div');
    let styleAttr =       'position: "absolute";left: 0;top: 0; '
    + 'font-size:' + blockStyles.fontSize + ';'
    + 'line-height: ' + blockStyles.lineHeight;

    el.setAttribute('style', styleAttr);
    el.innerHTML = 'jgyl/t"(';
    this.elRef.nativeElement.appendChild(el);
    let cssValue = el.getBoundingClientRect().height;
    el.outerHTML = '';

    return this._scaleFont(cssValue + 'px');
  }

}


  // ctx.shadowColor = “red” // string Color of the shadow;  RGB, RGBA, HSL, HEX, and other inputs are valid.
  // ctx.shadowOffsetX = 0; // integer Horizontal distance of the shadow, in relation to the text.
  // ctx.shadowOffsetY = 0; // integer Vertical distance of the shadow, in relation to the text.
  // ctx.shadowBlur = 10; // integer
