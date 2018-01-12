import { CustomBlankPage } from './../pages/custom/blank/blank';
import { StylePopoverPage } from './../pages/custom/style-popover';
import { ImageResizer } from '@ionic-native/image-resizer';
import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { ImagePicker } from '@ionic-native/image-picker';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Keyboard } from '@ionic-native/keyboard';
import { TextBlockComponent } from './../components/text-block/text-block';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { SplashPage } from '../pages/splash/splash';
import { HomePage } from '../pages/home/home';
import { CustomWholePage } from '../pages/custom/whole/whole';
import { CustomTopBottomPage } from '../pages/custom/top-bottom/top-bottom';
import { CustomTextComponent } from '../components/custom-text/custom-text';
import { ContainerSizeService } from '../services/ContainerSizeService';
import { MemeStyleService } from '../services/MemeStyleService';

import { BatmanPage } from '../pages/memes/batman/batman';
import { OrangePage } from '../pages/memes/orange/orange';
import { DogePage } from '../pages/memes/doge/doge';
import { SuccPage } from '../pages/memes/succ/succ';
import { WonkaPage } from '../pages/memes/wonka/wonka';
import { MostInterestingManPage } from './../pages/memes/most-interesting-man/most-interesting-man';
import { ExpandingConsciousness } from '../pages/memes/expanding-consciousness/expanding-consciousness';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PepePage } from '../pages/memes/pepe/pepe';

import { CustomTextJaggedComponent } from '../components/custom-text-jagged/custom-text-jagged';

@NgModule({
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  declarations: [
    SplashPage,
    MyApp,
    TextBlockComponent,
    CustomTextComponent,
    CustomTextJaggedComponent,
    StylePopoverPage,
    HomePage,
    CustomWholePage,
    CustomTopBottomPage,
    CustomBlankPage,
    DogePage,
    WonkaPage,
    MostInterestingManPage,
    SuccPage,
    PepePage,
    ExpandingConsciousness,
    BatmanPage,
    OrangePage
  ],
  entryComponents: [
    SplashPage,
    MyApp,
    HomePage,
    CustomWholePage,
    CustomTopBottomPage,
    CustomBlankPage,
    StylePopoverPage,
    DogePage,
    WonkaPage,
    MostInterestingManPage,
    SuccPage,
    PepePage,
    ExpandingConsciousness,
    BatmanPage,
    OrangePage
  ],
  providers: [
    ContainerSizeService,
    MemeStyleService,
    StatusBar,
    SplashScreen,
    SocialSharing,
    Keyboard,
    ImagePicker,
    ImageResizer,
    File,
    Transfer,
    FilePath,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
