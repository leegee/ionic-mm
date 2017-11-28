import { ImageResizer } from '@ionic-native/image-resizer';
import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { ImagePicker } from '@ionic-native/image-picker';
import { SocialSharing } from '@ionic-native/social-sharing';
import { TextBlockComponent } from './../components/text-block/text-block';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { CustomPage } from '../pages/custom/custom';

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
    CustomPage,
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
    CustomPage,
    DogePage,
    WonkaPage,
    SuccPage,
    PepePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SocialSharing,
    ImagePicker,
    ImageResizer,
    File,
    Transfer,
    FilePath,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
