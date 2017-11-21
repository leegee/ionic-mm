import { Meme } from '../../models/meme';
import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

@Component({
  selector: 'page-create',
  templateUrl: 'create.html'
})
export class CreateMeme {
  memeIndex: number;
  meme: Meme;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private screenOrientation: ScreenOrientation,
    public events: Events
  ) {
    this.memeIndex = this.navParams.data;
    this.meme.subscribeToLifecycleEvents(
      this.events
    );
    // if (this.meme.height > this.meme.width) {
    //   this.screenOrientation.lock('portrait');
    // }
    // else if (this.meme.height < this.meme.width) {
    //   this.screenOrientation.lock('landscape');
    // }
    // this.app.viewDidEnter.subscribe(
    //   view => console.log("Current opened view is : " + view.name);
    // )
  }

  // Lifecycle
  ionViewDidEnter() {
    console.info('-----------view loaded')
    this.events.publish('create:loaded');
  }

}
