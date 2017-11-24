import { WonkaPage } from './../memes/wonka/wonka';
import { DogePage } from './../memes/doge/doge';
import { SuccPage } from './../memes/succ/succ';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PepePage } from '../memes/pepe/pepe';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public blankMemes: Array<any> = [];
  constructor(
    public navCtrl: NavController
  ) {
    this.blankMemes = [
      DogePage,
      SuccPage,
      WonkaPage,
      PepePage,
      DogePage,
      SuccPage,
    ];

  }
}
