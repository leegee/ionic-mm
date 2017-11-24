import { Component, ElementRef, AfterViewChecked } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Meme } from '../../../components/meme/meme';

@IonicPage()
@Component({
  selector: 'page-memedoge',
  templateUrl: 'memedoge.html'
})
export class MemedogePage extends Meme {
  static thumbnailUrl: string = 'assets/imgs/doge_thumb.jpg';
  static title: string = 'Doge';
  imageUrl: string = 'assets/imgs/doge.jpg';
  width: number = 800;
  height: number = 450;
  fontSize: string = '4vw';
  fontWeight: string = 'normal';
  fontFamily: string = 'Comic Sans,PermanentMarkerRegular';

  constructor(
    navCtrl: NavController,
    navParams: NavParams,
    elRef: ElementRef
  ) {
    super(navCtrl, navParams, elRef);
  }

}
