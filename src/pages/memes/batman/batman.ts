import { ContainerSizeService } from './../../../components/ContainerSizeService';
import { Component, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Meme } from '../../../components/meme/meme';

@IonicPage()
@Component({
  selector: 'page-batman',
  templateUrl: 'batman.html'
})
export class BatmanPage extends Meme {
  static thumbnailUrl: string = 'assets/imgs/batman.jpg';
  static title: string = 'Batman and Robin';
  imageUrl: string = 'assets/imgs/batman.jpg';
  width: number = 400;
  height: number = 387;

  constructor(
    public elRef: ElementRef,
    public containerSizeService: ContainerSizeService
  ) {
    super(elRef, containerSizeService);
  }

}
