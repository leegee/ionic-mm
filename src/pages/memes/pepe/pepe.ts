import { Component, ElementRef, AfterViewChecked } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Meme } from '../../../components/meme/meme';

@IonicPage()
@Component({
  selector: 'page-succ',
  templateUrl: 'pepe.html',
})
export class PepePage extends Meme {
  static title: string = 'Pepe';
  static imageUrl: string = 'assets/imgs/pepe.jpg';
  static thumbnailUrl: string = 'assets/imgs/pepe.jpg';
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
    return PepePage[field];
  }
}
