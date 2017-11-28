import { Component } from '@angular/core';

/**
 * Generated class for the CustomTextComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'custom-text',
  templateUrl: 'custom-text.html'
})
export class CustomTextComponent {

  text: string;

  constructor() {
    console.log('Hello CustomTextComponent Component');
    this.text = 'Hello World';
  }

}
