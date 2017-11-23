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
  static thumbnailUrl: string = 'assets/imgs/succ.jpg';
  imageUrl: string = 'assets/imgs/succ.jpg';
  width: number = 600;
  height: number = 600;

  constructor(
    navCtrl: NavController,
    navParams: NavParams,
    elRef: ElementRef
  ) {
    super(navCtrl, navParams, elRef);
  }
}
