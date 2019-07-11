import { Component } from '@angular/core';

/**
 * Generated class for the MatrixModalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'matrix-modal',
  templateUrl: 'matrix-modal.html'
})
export class MatrixModalComponent {

  text: string;

  constructor() {
    console.log('Hello MatrixModalComponent Component');
    this.text = 'Hello World';
  }

}
