import { ContainerSizeService } from './../../../services/ContainerSizeService';
import { Component, ElementRef } from '@angular/core';
import { IonicPage, NavController, AlertController, Platform } from 'ionic-angular';
import { Meme } from '../../../components/meme/meme';

@IonicPage()
@Component({
  selector: 'page-orange',
  templateUrl: 'orange.html',
})
export class OrangePage extends Meme {
  static title: string = 'Orange Lad';
  static thumbnailUrl: string = 'assets/imgs/orange.jpg';
  imageUrl = ['assets/imgs/orange.jpg'];
  width: number = 640;
  height: number = 480;

  constructor(
    protected alertCtrl: AlertController,
    public navCtrl: NavController,
    public elRef: ElementRef,
    public containerSizeService: ContainerSizeService,
    protected platform: Platform
  ) {
    super(alertCtrl, navCtrl, elRef, containerSizeService, platform);
  }
}
