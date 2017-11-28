import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer';
import { File } from '@ionic-native/file';
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
  public userImageSrc: string;

  public static WIDTH = 800;
  public static HEIGHT = 800;

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
    this.isWeb = ! this.platform.is('android');
    console.log('isWeb?', this.isWeb);
  }

  androidPickImage() {
    this.imagePicker.getPictures({
      maximumImagesCount: 1
    }).then((results) => {
      let path = results[0];
      console.log('Got image path: ', path);
      this.filePath.resolveNativePath(path)
        .then(filePath => {
          console.log('filePath',filePath);
          let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
          console.log('correctPath', correctPath);
          let currentName = path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('?'));
          console.log('currentName', currentName);
          this.userImageSrc = this.createFileName(currentName);
          console.log('userImageSrc=', this.userImageSrc);
          this.copyFileToLocalDir(correctPath, currentName, this.userImageSrc);
          console.log('this.userImageSrc', this.userImageSrc);
          this.imageResizer.resize({
            uri: this.userImageSrc,
            // folderName: 'Protonet',
            quality: 100,
            width: CustomPage.WIDTH,
            height: CustomPage.HEIGHT
           } as ImageResizerOptions)
        }).catch(e => {
          this.presentToast('Error resizing image: ' + e.toString());
        });
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }

  private ionViewDidLoad() {
    if (!this.isWeb) {
      // console.log('Android-------------------------------------------');
      if (!this.imagePicker.hasReadPermission()) {
        this.imagePicker.requestReadPermission().then(() => {
          this.androidPickImage();
        })
      } else {
        this.androidPickImage();
      }
    }
  }

  private presentToast(text) {
    this.toastCtrl.create({
      message: text,
      duration: 5 * 60,
      position: 'top'
    }).present();
  }

  private createFileName(currentName) {
    let ext = currentName.match(/\.(\w+)$/)[1];
    return new Date().getTime() + '.' + ext;
  }

  // constructor(public navCtrl: NavController, private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController) { }

  private copyFileToLocalDir(namePath, currentName, newFileName) {
    console.log('Enter copyFileToLocalDir');
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  getImageFile(event) {
    let imgBlob = event.target.files[0];
    let reader = new FileReader();
    reader.onload = (e:Event) => {
      this.userImageSrc = (<FileReader>e.target).result;
    };

    reader.readAsDataURL(imgBlob);
  }
}