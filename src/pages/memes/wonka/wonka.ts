import { Component, ElementRef, AfterViewChecked } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Meme } from '../../../components/meme/meme';

@IonicPage()
@Component({
  selector: 'page-wonka',
  templateUrl: 'wonka.html',
})
export class WonkaPage extends Meme {
  static title: string = 'Wonka';
  static thumbnailUrl: string = 'assets/imgs/wonka.jpg';
  title = 'Wonka';
  imageUrl: string = 'assets/imgs/wonka.jpg';
  width: number = 550;
  height: number = 545;

  constructor(
    navCtrl: NavController,
    navParams: NavParams,
    elRef: ElementRef
  ) {
    super(navCtrl, navParams, elRef);
  }
}
