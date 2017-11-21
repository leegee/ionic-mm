import { Component, ElementRef, AfterViewChecked } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Meme } from '../../models/meme';


@IonicPage()
@Component({
  selector: 'page-memedoge',
  templateUrl: 'memedoge.html',
})
export class MemedogePage extends Meme implements AfterViewChecked {
  elRef: ElementRef;
  static title = 'Doge';
  static imageUrl = 'assets/imgs/doge.jpg';
  static thumbnailUrl = 'assets/imgs/doge_thumb.jpg';
  static width = 800;
  static height = 450;
  public scale: { x: number; y: number; };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    elRef: ElementRef
  ) {
    super();
    this.textBlocks = [];
    this.elRef = elRef;
  }

  get(field: string) {
    return MemedogePage[field];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MemedogePage');
  }

  ngAfterViewChecked() {
    var img = this.elRef.nativeElement.querySelector('img');
    var memeContainer = this.elRef.nativeElement.querySelector('.meme-container');
    console.log('-----memeContainer', memeContainer);

    // https://stackoverflow.com/questions/37256745/object-fit-get-resulting-dimensions
    function getRenderedSize(contains, cWidth, cHeight, width, height, pos) {
      var oRatio = width / height,
        cRatio = cWidth / cHeight;
      return function () {
        if (contains ? (oRatio > cRatio) : (oRatio < cRatio)) {
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
      return getRenderedSize(true,
        img.width,
        img.height,
        img.naturalWidth,
        img.naturalHeight,
        parseInt(pos[0]));
    }

    var renderedImg = getImgSizeInfo(img);
    console.log('Rendered:', renderedImg.width, MemedogePage.width, renderedImg.height, MemedogePage.height);
    this.scale = {
      x: renderedImg.width / MemedogePage.width,
      y: renderedImg.height / MemedogePage.height
    };

    memeContainer.style.width = renderedImg.width + 'px';
    memeContainer.style.height = renderedImg.height + 'px';

    console.log('scale`=',this.scale);
  }

  // ngAfterViewInit() {
  //   this.renderer.invokeElementMethod(this.d1.nativeElement', 'insertAdjacentHTML' ['beforeend', '<div class="two">two</div>']);
  // }

  setAnchor(
    x: number,
    y: number,
    text?: string
  ) {
    console.log(this);
  }

}
