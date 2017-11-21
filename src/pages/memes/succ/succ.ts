import { Component, ElementRef, AfterViewChecked } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Meme } from '../../../components/meme/meme';

@IonicPage()
@Component({
  selector: 'page-succ',
  templateUrl: 'succ.html',
})
export class SuccPage extends Meme {
  static title: string = 'Mr Succ';
  static imageUrl: string = 'assets/imgs/succ.jpg';
  static thumbnailUrl: string = 'assets/imgs/succ_thumb.jpg';
  static width: number = 600;
  static height: number = 600;

  constructor(
    navCtrl: NavController,
    navParams: NavParams,
    elRef: ElementRef
  ) {
    super(navCtrl, navParams, elRef);
  }

  get(field: string) {
    return SuccPage[field];
  }
}
