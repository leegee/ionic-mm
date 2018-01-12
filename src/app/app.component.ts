import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { CustomWholePage } from '../pages/custom/whole/whole';
import { CustomTopBottomPage } from './../pages/custom/top-bottom/top-bottom';
import { CustomBlankPage } from '../pages/custom/blank/blank';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  libraryPages: Array<{ title: string, component: any }>;
  customPages: Array<{ title: string, component: any }>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen
  ) {
    this.initializeApp();

    this.libraryPages = [
      { title: 'Dank Memes', component: HomePage }
    ];
    this.customPages = [
      { title: 'Text covers page', component: CustomWholePage },
      { title: 'Top and bottom', component: CustomTopBottomPage },
      { title: 'Add your own text', component: CustomBlankPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      var scale = 'scale(1)';
      document.body.style.webkitTransform = scale;
      document.body.style.transform = scale;
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
