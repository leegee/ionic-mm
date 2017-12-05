import { ContainerSizeService } from './../../../services/ContainerSizeService';
import { Component, ElementRef } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Meme } from '../../../components/meme/meme';

@IonicPage()
@Component({
  selector: 'page-succ',
  templateUrl: 'succ.html',
})
export class SuccPage extends Meme {
  static title: string = 'Mr Succ';
  static thumbnailUrl: string = 'assets/imgs/succ.jpg';
  imageUrl: string = 'assets/imgs/succ.jpg';
  width: number = 600;
  height: number = 600;

  constructor(
    public navCtrl: NavController,
    public elRef: ElementRef,
    public containerSizeService: ContainerSizeService
  ) {
    super(navCtrl, elRef, containerSizeService);
  }
}
