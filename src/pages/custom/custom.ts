import { MemeStyleService } from '../../services/MemeStyleService';
import { CustomTextComponent } from './../../components/custom-text/custom-text';
import { StylePopoverPage } from './StylePopoverPage';
import { PopoverController } from 'ionic-angular';
import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer';
import { File, FileEntry } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { ImagePicker } from '@ionic-native/image-picker';
import { Component, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ToastController } from 'ionic-angular';
import { ContainerSizeService } from '../../services/ContainerSizeService';
import { AfterViewInit, DoCheck } from '@angular/core/src/metadata/lifecycle_hooks';

@IonicPage()
@Component({
  selector: 'page-custom',
  templateUrl: 'custom.html'
})
export class CustomPage implements AfterViewInit, DoCheck {

  public isWeb: boolean;
  public imageUrl: string;
  public resizeWidth: number = 800;
  public resizeHeight: number = 800;
  public width: string = "800";
  public height: string = "800";
  public instance: any;

  private container: HTMLElement;
  private img: HTMLImageElement;

  constructor(
    public popoverCtrl: PopoverController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private file: File,
    private filePath: FilePath,
    private toastCtrl: ToastController,
    private platform: Platform,
    private imagePicker: ImagePicker,
    private imageResizer: ImageResizer,
    private containerSizeService: ContainerSizeService,
    private MemeStyleService: MemeStyleService,
    private elRef: ElementRef
  ) {
    this.instance = this;
    this.isWeb = !this.platform.is('android');
  }

  ngAfterViewInit() {
    if (!this.img) {
      this.img = this.elRef.nativeElement.querySelector('img');
      this.container = this.elRef.nativeElement.querySelector('#meme-text-container');
    }
  }

  ngDoCheck() {
    if (this.img) {
      this.setSizes();
    }
  }

  setSizes() {
    let { width, height } = this.containerSizeService.containerSizeFromImg(this.img);
    if (width !== null) {
      this.width = width;
      this.height = height;
      this.container.style.width = width;
      this.container.style.height = height;
    }
  }

  androidPickImage() {
    this.imagePicker.getPictures({
      maximumImagesCount: 1
    }).then((results) => {
      let path: string = results[0];
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

  getImageFile(event) {
    let imgBlob = event.target.files[0];
    let reader = new FileReader();
    reader.onload = (e: Event) => {
      this.imageUrl = (<FileReader>e.target).result;
    };
    reader.readAsDataURL(imgBlob);
  }

  onImageLoad() {
    //   console.log('Now...', this.img, this.img.width, this.img.height);
    // Just having this 'onLoad' handler in place slows down the
    // code enough that the image render  -- apparently and undocumented async --
    // has completed by the time the view-updated lifecycle hook is called.
    // However, best to do the job properly:
    this.setSizes();
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(StylePopoverPage, {});
    popover.present({
      ev: event
    });
  }

  private showError(text) {
    this.toastCtrl.create({
      message: text,
      duration: 20000,
      position: 'top'
    }).present();
  }

}