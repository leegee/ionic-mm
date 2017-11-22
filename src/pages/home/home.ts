import { WonkaPage } from './../memes/wonka/wonka';
import { MemedogePage } from './../memes/memedoge/memedoge';
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
      MemedogePage,
      SuccPage,
      WonkaPage,
      PepePage,
      MemedogePage,
      SuccPage,
    ];

  }
}
