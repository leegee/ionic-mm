import { SplashScreen } from '@ionic-native/splash-screen';
import { Component } from '@angular/core';
import { IonicPage, ViewController, Platform } from 'ionic-angular';

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
    this.splashScreen.hide();
    this.platform.is('android')? setTimeout(() => {
      this.viewCtrl.dismiss();
    }, 2000) : this.viewCtrl.dismiss();
  }
}



