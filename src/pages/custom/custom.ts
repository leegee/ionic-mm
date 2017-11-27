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
  private file: File;
  private lastImage: string;
  private userImage: string; // TODO type
  private filePath: FilePath;
  private imagePicker: ImagePicker;
  private platform: Platform;
  private toastCtrl: ToastController;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // this.toastCtrl = new ToastController();
    // this.file = new File();
    // this.filePath = new FilePath();
    // this.platform = new Platform();
    // this.imagePicker = new ImagePicker();
  }

  pickImage() {
    this.imagePicker.getPictures({
      maximumImagesCount: 1
    }).then((results) => {
      let path = results[0];
      console.log('Image: ', path);
      if (this.platform.is('android')) {
        this.filePath.resolveNativePath(path)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      }
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }

  private ionViewDidLoad() {
    console.log('ionViewDidLoad CustomPage');
    if (!this.imagePicker.hasReadPermission()) {
      this.imagePicker.requestReadPermission().then(() => {
        this.pickImage();
      })
    } else {
      this.pickImage();
    }
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  // constructor(public navCtrl: NavController, private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController) { }

  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }
}