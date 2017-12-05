import { ContainerSizeService } from './../../../services/ContainerSizeService';
import { Component, ElementRef } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Meme } from '../../../components/meme/meme';

@IonicPage()
@Component({
  selector: 'page-doge',
  templateUrl: 'doge.html'
})
export class DogePage extends Meme {
  static thumbnailUrl: string = 'assets/imgs/doge_thumb.jpg';
  static title: string = 'Doge';
  imageUrl: string = 'assets/imgs/doge.jpg';
  width: number = 800;
  height: number = 450;

  constructor(
    public  navCtrl: NavController,
    public elRef: ElementRef,
    public containerSizeService: ContainerSizeService
  ) {
    super(navCtrl, elRef, containerSizeService);
  }
}
