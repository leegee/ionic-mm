import { ContainerSizeService } from './../../../services/ContainerSizeService';
import { Component, ElementRef } from '@angular/core';
import { IonicPage, NavController, AlertController, Platform } from 'ionic-angular';
import { Meme } from '../../../components/meme/meme';

@IonicPage()
@Component({
  selector: 'page-most-interesting-man',
  templateUrl: 'most-interesting-man.html',
})
export class MostInterestingManPage extends Meme {
  static title: string = 'The Most Interesting Man In The World';
  static thumbnailUrl: string = 'assets/imgs/most-interesting-man.jpg';
  title = 'The Most Interesting Man In The World';
  imageUrl: string = 'assets/imgs/most-interesting-man.jpg';
  width: number = 550;
  height: number = 690;

  constructor(
    protected alertCtrl: AlertController,
    public  navCtrl: NavController,
    public elRef: ElementRef,
    public containerSizeService: ContainerSizeService,
    protected platform: Platform
  ) {
    super(alertCtrl, navCtrl, elRef, containerSizeService, platform);
  }
}
