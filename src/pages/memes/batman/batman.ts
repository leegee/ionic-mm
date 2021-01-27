import { ContainerSizeService } from './../../../services/ContainerSizeService';
import { Component, ElementRef } from '@angular/core';
import { IonicPage, NavController, AlertController, Platform } from 'ionic-angular';
import { Meme } from '../../../components/meme/meme';

@IonicPage()
@Component({
  selector: 'page-batman',
  templateUrl: 'batman.html'
})
export class BatmanPage extends Meme {
  static thumbnailUrl: string = 'assets/imgs/batman.jpg';
  static title: string = 'Batman and Robin';
  imageUrl = ['assets/imgs/batman.jpg'];
  width: number = 400;
  height: number = 387;

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
