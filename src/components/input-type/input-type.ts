import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'input-type',
  templateUrl: 'input-type.html'
})
export class InputTypeComponent {

  @Input() data: any;
  @Input() isLast: boolean;
  @Output() nextCallBack = new EventEmitter();
  @Output() previousCallBack = new EventEmitter()

  constructor() {
    console.log('Hello RadioTypeComponent Component');
  }

  next(status?: any) {
    this.data.isCompleted = (this.data.value && this.data.value.length) ? true : false;
    this.nextCallBack.emit(status);
  }

  back() {
    this.data.isCompleted = (this.data.value && this.data.value.length) ? true : false;
    this.previousCallBack.emit('previous');
  }

}
