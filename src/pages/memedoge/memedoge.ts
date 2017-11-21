import { Component, ElementRef, AfterViewChecked } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Meme } from '../../components/meme/meme';

@IonicPage()
@Component({
  selector: 'page-memedoge',
  templateUrl: 'memedoge.html',
})
export class MemedogePage extends Meme {
  static title: string = 'Doge';
  static imageUrl: string = 'assets/imgs/doge.jpg';
  static thumbnailUrl: string = 'assets/imgs/doge_thumb.jpg';
  static width: number = 800;
  static height: number = 450;

  constructor(
    navCtrl: NavController,
    navParams: NavParams,
    elRef: ElementRef
  ) {
    super(navCtrl, navParams, elRef);
  }

  get(field: string) {
    return MemedogePage[field];
  }
}
