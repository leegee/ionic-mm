import { MemedogePage } from './../memedoge/memedoge';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

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
      MemedogePage,MemedogePage,MemedogePage,MemedogePage,MemedogePage
    ];

  }
}
