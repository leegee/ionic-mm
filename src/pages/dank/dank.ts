import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

interface TypeMeme {
  title: string;
  templateUrl: string;
  thumbnailUrl: string;
  imageUrl: string[];
  width: number;
  height: number;
};

@Component({
  selector: 'page-dank',
  templateUrl: 'dank.html'
})
export class DankPage {
  selectedMeme: TypeMeme;
  memes: Array<TypeMeme>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedMeme = navParams.get('selectedMeme');
    this.memes = [{
      title: 'Doge',
      templateUrl: '/pages/memes/doge.html',
      thumbnailUrl: 'assets/imgs/doge_thumb.jpg',
      imageUrl: ['assets/imgs/doge.jpg'],
      width: 800,
      height: 450
    }];

    console.log(this.memes);
  }

  itemTapped(event, selectedMeme) {
    // pushing to ourselves!
    this.navCtrl.push(DankPage, { selectedMeme });
  }
}
