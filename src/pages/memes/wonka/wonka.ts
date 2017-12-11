import { ContainerSizeService } from './../../../services/ContainerSizeService';
import { Component, ElementRef } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { Meme } from '../../../components/meme/meme';

@IonicPage()
@Component({
  selector: 'page-wonka',
  templateUrl: 'wonka.html',
})
export class WonkaPage extends Meme {
  static title: string = 'Wonka';
  static thumbnailUrl: string = 'assets/imgs/wonka.jpg';
  title = 'Wonka';
  imageUrl: string = 'assets/imgs/wonka.jpg';
  width: number = 550;
  height: number = 545;

  constructor(
    protected alertCtrl: AlertController,
    public  navCtrl: NavController,
    public elRef: ElementRef,
    public containerSizeService: ContainerSizeService
  ) {
    super(alertCtrl, navCtrl, elRef, containerSizeService);
  }
}
