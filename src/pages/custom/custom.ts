import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer';
import { File, FileEntry } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { ImagePicker } from '@ionic-native/image-picker';
import { Component, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ToastController } from 'ionic-angular';
import { ContainerSizeService } from '../../components/ContainerSizeService';
import { AfterViewInit, AfterViewChecked, DoCheck } from '@angular/core/src/metadata/lifecycle_hooks';

@IonicPage()
@Component({
  selector: 'page-custom',
  templateUrl: 'custom.html',
})
export class CustomPage implements AfterViewInit, AfterViewChecked, DoCheck {
  public isWeb: boolean;
  public imageUrl: string;
  public resizeWidth: number = 800;
  public resizeHeight: number = 800;
  public width: string = "800";
  public height: string = "800";

  private lastImage: string;
  private container: HTMLElement;
  private img: HTMLImageElement;

  // private imagePicker: ImagePicker;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private file: File,
    private filePath: FilePath,
    private toastCtrl: ToastController,
    private platform: Platform,
    private imagePicker: ImagePicker,
    private imageResizer: ImageResizer,
    private containerSizeService: ContainerSizeService,
    private elRef: ElementRef
  ) {
    this.isWeb = !this.platform.is('android');
    console.log('isWeb?', this.isWeb);
  }

  ngAfterViewInit() {
    if (!this.img) {
      this.img = this.elRef.nativeElement.querySelector('img');
      this.container = this.elRef.nativeElement.querySelector('#meme-text-container');
    }
  }

  ngAfterViewChecked() {
  }

  ngDoCheck() {
      if (this.img) {
        let { width, height } = this.containerSizeService.containerSizeFromImg(this.img, this.container);
        this.width = width;
        this.height = height;
      }
  }

  androidPickImage() {
    this.imagePicker.getPictures({
      maximumImagesCount: 1
    }).then((results) => {
      let path: string = results[0];
      let filename: string;
      this.filePath.resolveNativePath(path)
        .then(path => {
          let match = path.match(/^(.+?)\/([^/]+)(\.\w+)(?:\?.*)?$/);
          let dir: string = match[1];
          let name: string = match[2];
          let ext: string = match[3];
          console.log('this.file.dataDirectory', this.file.dataDirectory);
          return this.file.copyFile(
            dir, name + ext,
            this.file.dataDirectory, new Date().getTime() + ext
          );
        }).then((resizedFileEntry: FileEntry) => {
          console.log('copy file rv=', resizedFileEntry);
          return this.imageResizer.resize({
            uri: resizedFileEntry.nativeURL, // .fullPath
            // folderName: 'Protonet',
            quality: 100,
            width: this.resizeWidth,
            height: this.resizeHeight
          } as ImageResizerOptions)
        })
        .then((resizedFilePath) => {
          this.imageUrl = resizedFilePath;
        }).catch(e => {
          console.error(e);
          this.showError('Error resizing image: ' + e.toString());
        });
    }, (err) => {
      this.showError('Error while selecting image.');
    });
  }

  ionViewDidLoad() {
    if (!this.isWeb) {
      if (!this.imagePicker.hasReadPermission()) {
        this.imagePicker.requestReadPermission().then(() => {
          this.androidPickImage();
        })
      } else {
        this.androidPickImage();
      }
    }
  }

  private showError(text) {
    this.toastCtrl.create({
      message: text,
      duration: 20000,
      position: 'top'
    }).present();
  }

  public getImageFile(event) {
    let imgBlob = event.target.files[0];
    let reader = new FileReader();
    reader.onload = (e: Event) => {
      this.imageUrl = (<FileReader>e.target).result;
    };

    reader.readAsDataURL(imgBlob);
  }
}