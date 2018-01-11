import { AlertController } from 'ionic-angular';
import { ImageResizer } from '@ionic-native/image-resizer';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { ImagePicker } from '@ionic-native/image-picker';
import { Component, ElementRef } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { ContainerSizeService } from '../../../services/ContainerSizeService';
import { AfterViewInit, DoCheck } from '@angular/core/src/metadata/lifecycle_hooks';
import { CustomMeme } from '../../../components/meme/custom-meme';

@IonicPage()
@Component({
  selector: 'page-custom-top-bottom',
  templateUrl: 'top-bottom.html'
})
export class CustomTopBottomPage extends CustomMeme implements AfterViewInit, DoCheck {

  constructor(
    protected alertCtrl: AlertController,
    public navCtrl: NavController,
    protected file: File,
    protected filePath: FilePath,
    protected toastCtrl: ToastController,
    protected imagePicker: ImagePicker,
    protected imageResizer: ImageResizer,
    protected containerSizeService: ContainerSizeService,
    protected elRef: ElementRef
  ) {
    super(alertCtrl, navCtrl, file, filePath, toastCtrl, imagePicker, imageResizer, containerSizeService, elRef);
  }
}
