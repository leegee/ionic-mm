import { AlertController } from 'ionic-angular';
import { ImageResizer } from '@ionic-native/image-resizer';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { ImagePicker } from '@ionic-native/image-picker';
import { Component, ElementRef, OnInit } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { ContainerSizeService } from '../../../services/ContainerSizeService';
import { AfterViewInit, DoCheck } from '@angular/core/src/metadata/lifecycle_hooks';
import { CustomMeme } from '../../../components/meme/custom-meme';

@IonicPage()
@Component({
  selector: 'page-custom-blank',
  templateUrl: 'blank.html'
})
export class CustomBlankPage extends CustomMeme implements AfterViewInit, DoCheck {

  public imageUrl: string;
  public resizeWidth: number = 800;
  public resizeHeight: number = 800;
  protected textBlocksDisplayed = 1;

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

  ngAfterViewInit() {
    let done = 0;
    for (let textBlock of this.textBlocks.toArray()) {
      if (++done > 1) {
        textBlock.isHidden = true;
      } else {
        textBlock.isHidden = false;
      }
    }
  }

  onContainerClicked(e) {
    if (e.target.id === 'meme-text-container') {
      this.textBlocksDisplayed++;
      for (let textBlock of this.textBlocks.toArray()) {
        if (Number(textBlock.id) === this.textBlocksDisplayed) {
          textBlock.setPosition(e.clientX, e.clientY);
          textBlock.isHidden = false;
          setTimeout( () => {
            textBlock.sizeText();
          });
          break;
        }
      }
    }

  }
}
