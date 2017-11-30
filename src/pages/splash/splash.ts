import { SplashScreen } from '@ionic-native/splash-screen';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-splash',
  templateUrl: 'splash.html',
})
export class SplashPage {

  constructor(
    public viewCtrl: ViewController,
    public splashScreen: SplashScreen,
    private platform: Platform
  ) {
  }

  ionViewDidEnter() {
    let showTime = this.platform.is('android')? 2000 : 10000;
    this.splashScreen.hide();
    setTimeout(() => {
      this.viewCtrl.dismiss();
    }, showTime);
  }
}



