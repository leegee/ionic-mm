import { ContainerSizeService } from './../../../services/ContainerSizeService';
import { Component, ElementRef } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { Meme } from '../../../components/meme/meme';

@IonicPage()
@Component({
  selector: 'page-expanding-consciousness',
  templateUrl: 'expanding-consciousness.html'
})
export class ExpandingConsciousness extends Meme {
  static thumbnailUrl: string = 'assets/imgs/expanding-consciousness_thumb.jpg';
  static title: string = 'Expanding consciousness';
  imageUrl: string = 'assets/imgs/expanding-consciousness.jpg';
  width: number = 857;
  height: number = 1202;

  constructor(
    public elRef: ElementRef,
    public containerSizeService: ContainerSizeService
  ) {
    super(elRef, containerSizeService);
  }

}
