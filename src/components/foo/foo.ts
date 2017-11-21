import { Component } from '@angular/core';

/**
 * Generated class for the FooComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'foo',
  templateUrl: 'foo.html'
})
export class FooComponent {

  text: string;

  constructor() {
    console.log('Hello FooComponent Component');
    this.text = 'Hello World';
  }

}
