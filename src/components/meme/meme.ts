import { TextRendererOptions } from './../text-renderer';
import { NavController, AlertController, Platform } from 'ionic-angular';
import { Shareable } from './../shareable';
import { ElementRef, AfterViewChecked, QueryList, ViewChildren } from '@angular/core';
import { ContainerSizeService } from '../../services/ContainerSizeService';
import { TextBlockInterface } from '../text-block-interface';

export abstract class Meme implements AfterViewChecked {

  @ViewChildren('textinput') textBlocks: QueryList<TextBlockInterface>;
  static title: string;
  static thumbnailUrl: string;

  protected container: HTMLElement;
  protected img: HTMLImageElement;
  public imageUrl: string;
  public width: number;
  public height: number;
  protected isDirty: boolean = false;
  protected containerSize: { [key: string]: number };
  protected isWeb: boolean;

  public constructor(
    protected alertCtrl: AlertController,
    public navCtrl: NavController,
    protected elRef: ElementRef,
    protected containerSizeService: ContainerSizeService
  ) {
    this.isWeb = !new Platform().is('android');
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

  ionViewCanLeave() {
    if (this.isDirty) {
      return new Promise((resolve: Function, reject: Function) => {
        let alert = this.alertCtrl.create({
          title: 'Are you sure?',
          message: 'If you leave now, your meme will be lost.',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                reject();
              }
            },
            {
              text: 'Leave',
              handler: () => {
                resolve();
              }
            }
          ]
        });
        alert.present();
      });
    }
  }

  share(goBack: boolean = true) {
    let b64img = this._createB64ShareableImage();
    Shareable.share(b64img);
    // if (goBack) {
    //   this.navCtrl.pop();
    // }
  }

  private _createB64ShareableImage() {
    let shareImg = new Image(
      this.img.naturalWidth, this.img.naturalHeight
    );
    shareImg.src = this.img.src;

    let canvas = document.createElement("canvas");
    canvas.id = "share-canvas";
    document.body.appendChild(canvas);

    let ctx = canvas.getContext("2d");
    ctx.canvas.width = shareImg.width;
    ctx.canvas.height = shareImg.height;
    ctx.drawImage(shareImg, 0, 0);

    this.textBlocks.forEach((textBlock) => {
      textBlock.render({
        nativeElement: this.elRef.nativeElement,
        ctx: ctx,
        width: shareImg.width,
        height: shareImg.height,
        displayedWidth: this.containerSize.width,
        displayedHeight: this.containerSize.height
      } as TextRendererOptions);
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
}

