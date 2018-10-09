import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'matrix-type',
  templateUrl: 'matrix-type.html'
})
export class MatrixTypeComponent {

  @Input() data: any;
  @Input() isLast: boolean;
  @Input() isFirst: boolean;
  @Output() nextCallBack = new EventEmitter();
  @Output() previousCallBack = new EventEmitter()
  @Input() evidenceId: string;

  constructor() {
    console.log('Hello MatrixTypeComponent Component');
    // this.text = 'Hello World';
  }

}
