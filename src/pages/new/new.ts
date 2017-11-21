import { MemedogePage } from '../memedoge/memedoge';

import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'new-page',
  templateUrl: 'new.html'
})
export class NewPage {
  blankMemes: Array<any> = [];
  constructor(
    public navCtrl: NavController
  ) {
    this.blankMemes = [
      MemedogePage
    ];
  }
}
