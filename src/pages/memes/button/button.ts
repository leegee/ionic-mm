import { ContainerSizeService } from './../../../services/ContainerSizeService';
import { Component, ElementRef } from '@angular/core';
import { IonicPage, NavController, AlertController, Platform } from 'ionic-angular';
import { Meme } from '../../../components/meme/meme';

@IonicPage()
@Component({
  selector: 'page-button',
  templateUrl: 'button.html'
})
export class ButtonPage extends Meme {
  static thumbnailUrl: string = 'assets/imgs/button.jpg';
  static title: string = 'Button';
  imageUrl = ['assets/imgs/button.jpg'];
  width: number = 600;
  height: number = 908;

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
