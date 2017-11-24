import { SocialSharing } from '@ionic-native/social-sharing';
import { TextBlockComponent } from './../components/text-block/text-block';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { DogePage } from '../pages/memes/doge/doge';
import { SuccPage } from '../pages/memes/succ/succ';
import { WonkaPage } from '../pages/memes/wonka/wonka';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PepePage } from '../pages/memes/pepe/pepe';

@NgModule({
  declarations: [
    MyApp,
    TextBlockComponent,
    HomePage,
    ListPage,
    DogePage,
    WonkaPage,
    SuccPage,
    PepePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    DogePage,
    WonkaPage,
    SuccPage,
    PepePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SocialSharing,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
