import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer';
import { File, FileEntry } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { ImagePicker } from '@ionic-native/image-picker';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ToastController } from 'ionic-angular';

declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-custom',
  templateUrl: 'custom.html',
})
export class CustomPage {
  private lastImage: string;
  public isWeb: boolean;
  public imageUrl: string;

  public width: number = 800;
  public height: number = 800;

  // private imagePicker: ImagePicker;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private file: File,
    private filePath: FilePath,
    private toastCtrl: ToastController,
    private platform: Platform,
    private imagePicker: ImagePicker,
    private imageResizer: ImageResizer
  ) {
    this.isWeb = !this.platform.is('android');
    console.log('isWeb?', this.isWeb);
  }

  androidPickImage() {
    this.imagePicker.getPictures({
      maximumImagesCount: 1
    }).then((results) => {
      let path: string = results[0];
      let filename: string;
      console.log('Got image path: ', path);
      this.filePath.resolveNativePath(path)
        .then(path => {
          console.log('Resolved image path: ', path);
          let match = path.match(/^(.+?)\/([^/]+)(\.\w+)(?:\?.*)?$/);
          let dir: string = match[1];
          let name: string = match[2];
          let ext: string = match[3];
          // let newFilename: string = new Date().getTime() + ext;
          // console.log('###', dir, name,
          //   this.file.dataDirectory, newFilename
          // );
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
            width: this.width,
            height: this.height
          } as ImageResizerOptions)
        })
        .then((resizedFilePath) => {
          console.log('Resize rv=', resizedFilePath);
          this.imageUrl = resizedFilePath;
          console.log('Resized ', this.imageUrl);
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