import { NavController } from 'ionic-angular';
import { Shareable } from './../shareable';
import { ElementRef, AfterViewChecked, QueryList, ViewChildren } from '@angular/core';
import { ContainerSizeService } from '../../services/ContainerSizeService';
import { TextBlockComponent } from '../text-block/text-block';
import { CustomTextComponent } from '../custom-text/custom-text';
import { TextBlockInterface } from '../text-block-interface';

export abstract class Meme implements AfterViewChecked {

  @ViewChildren('textinput') textBlocks: QueryList<TextBlockInterface>;

  static title: string;
  static thumbnailUrl: string;
  private static textStyleRules = ['textAlign', 'color', 'fontSize', 'fontFamily', 'fontWeight', 'lineHeight', 'position', 'left', 'top', 'bottom', 'right'];
  protected container: HTMLElement;
  protected img: HTMLImageElement;
  public imageUrl: string;
  public width: number;
  public height: number;

  public constructor(
    public  navCtrl: NavController,
    protected elRef: ElementRef,
    protected containerSizeService: ContainerSizeService
  ) {
  }

  ngAfterViewChecked() {
    if (!this.img) {
      this.img = this.elRef.nativeElement.querySelector('img');
      this.container = this.elRef.nativeElement.querySelector('#meme-text-container');
    }
    this.setContainerSize();
  }

  setContainerSize() {
    let { width, height } = this.containerSizeService.containerSizeFromImg(this.img);
    this.container.style.width = width;
    this.container.style.height = height;
  }

  // updated(textblock: TextBlockComponent | CustomTextComponent) {
  //   console.log('meme updated!');
  //   this.textBlocks[textblock.id] = textblock;
  // }

  share() {
    let img = this._base64memeImage();
    Shareable.share(img);
    console.log('this.navCtrl', this.navCtrl);
    this.navCtrl.pop();
  }

  private _getStyles = (textBlock: TextBlockInterface) => {
    let textBlockStyle = Object.assign.apply(Object, [
      {},
      document.defaultView.getComputedStyle(this.container),
      document.defaultView.getComputedStyle(textBlock.getStyledParentElement()),
      document.defaultView.getComputedStyle(textBlock.getStyledElement()),
    ]);

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

  private _literal(pc, xy) {
    let integer = pc.match(/^(\d+)/)[1];
    return integer * (xy / 100);
  }

  private _base64memeImage() {
    console.log('this.width, this.height', this.width, this.height);
    let img: HTMLImageElement = new Image(this.width, this.height);
    img.src = this.img.src;

    let canvas = document.createElement("canvas");
    canvas.id = "screenshot-canvas";
    document.body.appendChild(canvas);

    let ctx = canvas.getContext("2d");
    ctx.canvas.width = img.width;
    ctx.canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    this.textBlocks.forEach((textBlock) => {
      let blockStyles: { [key: string]: string } = this._getStyles(textBlock);
      // console.log('textblock ', id, this.textBlocks[id], "\n", blockStyles, "\nMEME TEXT:", this.textBlocks[id].text);
      ctx.font = [
        blockStyles.fontWeight || '',
        blockStyles.fontSize || '',
        blockStyles.fontFamily || ''
      ].join(' ');
      if (blockStyles.textAlign) {
        ctx.textAlign = blockStyles.textAlign;
      }
      ctx.textBaseline = 'middle';
      ctx.fillStyle = textBlock.getClr() || '#000000';
      ctx.fillText(
        textBlock.getText(),
        this._literal(blockStyles.left, img.width),
        this._literal(blockStyles.top, img.height)
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
