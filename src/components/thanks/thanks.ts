import { Component } from '@angular/core';

/**
 * Generated class for the ThanksComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'thanks',
  templateUrl: 'thanks.html'
})
export class ThanksComponent {

  text: string;

  constructor() {
    console.log('Hello ThanksComponent Component');
    this.text = 'Hello World';
  }

}
