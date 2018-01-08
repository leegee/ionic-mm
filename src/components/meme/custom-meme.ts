import { StylePopoverPage } from '../../pages/custom/style-popover';
import { PopoverController, AlertController } from 'ionic-angular';
import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer';
import { File, FileEntry } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { ImagePicker } from '@ionic-native/image-picker';
import { ElementRef, ViewChildren, QueryList } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { ContainerSizeService } from '../../services/ContainerSizeService';
import { AfterViewInit, DoCheck } from '@angular/core/src/metadata/lifecycle_hooks';
import { TextBlockInterface } from '../text-block-interface';
import { Meme } from './meme';

export abstract class CustomMeme extends Meme implements AfterViewInit, DoCheck {

    @ViewChildren('textinput') textBlocks: QueryList<TextBlockInterface>;
    static title: string;
    static thumbnailUrl: string;

    protected container: HTMLElement;
    protected img: HTMLImageElement;
    public imageUrl: string;
    public width: number;
    public height: number;
    protected isDirty: boolean = false;
    protected containerSize: { [key: string]: number };
    protected isWeb: boolean;

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
        super(alertCtrl, navCtrl, elRef, containerSizeService);
    }

    ngAfterViewInit() {
        if (!this.img) {
            this.img = this.elRef.nativeElement.querySelector('img');
            this.container = this.elRef.nativeElement.querySelector('#meme-text-container');
        }
    }

    ngDoCheck() {
        if (this.img) {
            this._setSizes();
        }
    }

    private _setSizes() {
        let sizes = this.containerSizeService.size(this.img);
        if (sizes.width !== null) {
            this.width = Math.floor(sizes.width);
            this.height = Math.floor(sizes.height);
            this.container.style.width = sizes.width + 'px';
            this.container.style.height = sizes.height + 'px';
        }
    }

    private _androidPickImage() {
        this.imagePicker.getPictures({
            maximumImagesCount: 1
        }).then((results) => {
            let path: string = results[0];
            this.filePath.resolveNativePath(path)
                .then(path => {
                    let [, dir, name, ext] = path.match(/^(.+?)\/([^/]+)(\.\w+)(?:\?.*)?$/);
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
                    this.isDirty = true;
                }).catch(e => {
                    console.error(e);
                    this._showError('Error resizing image: ' + e.toString());
                });
        }, (err) => {
            this._showError('Error while selecting image.');
        });
    }

    ionViewDidLoad() {
        if (!this.isWeb) {
            if (!this.imagePicker.hasReadPermission()) {
                this.imagePicker.requestReadPermission().then(() => {
                    this._androidPickImage();
                })
            } else {
                this._androidPickImage();
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
        this._setSizes();
    }

    presentPopover(event) {
        let popover = this.popoverCtrl.create(StylePopoverPage, {});
        popover.present({
            ev: event
        });
    }

    private _showError(text) {
        this.toastCtrl.create({
            message: text,
            duration: 20000,
            position: 'top'
        }).present();
    }

}