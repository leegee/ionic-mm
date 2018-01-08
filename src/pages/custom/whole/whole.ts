import { StylePopoverPage } from '../style-popover';
import { PopoverController, AlertController } from 'ionic-angular';
import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer';
import { File, FileEntry } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { ImagePicker } from '@ionic-native/image-picker';
import { Component, ElementRef } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { ContainerSizeService } from '../../../services/ContainerSizeService';
import { AfterViewInit, DoCheck } from '@angular/core/src/metadata/lifecycle_hooks';
import { CustomMeme } from '../../../components/meme/custom-meme';

@IonicPage()
@Component({
  selector: 'page-custom-whole',
  templateUrl: 'whole.html'
})
export class CustomWholePage extends CustomMeme implements AfterViewInit, DoCheck {

  public imageUrl: string;
  public resizeWidth: number = 800;
  public resizeHeight: number = 800;

  constructor(
    protected alertCtrl: AlertController,
    public popoverCtrl: PopoverController,
    public navCtrl: NavController,
    protected file: File,
    protected filePath: FilePath,
    protected toastCtrl: ToastController,
    protected imagePicker: ImagePicker,
    protected imageResizer: ImageResizer,
    protected containerSizeService: ContainerSizeService,
    protected elRef: ElementRef
  ) {
    super(alertCtrl, popoverCtrl, navCtrl, file, filePath, toastCtrl, imagePicker, imageResizer, containerSizeService, elRef);
  }

}