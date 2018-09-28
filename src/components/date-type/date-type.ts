import { Component, Input, Output, EventEmitter } from '@angular/core';


/**
 * Generated class for the DateTypeComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'date-type',
  templateUrl: 'date-type.html'
})
export class DateTypeComponent {
  @Input() data: any;
  @Input() isLast: boolean;
  @Input() isFirst: boolean;
  @Output() nextCallBack = new EventEmitter();
  @Output() previousCallBack = new EventEmitter()

  constructor() {
    console.log('Hello DateTypeComponent Component');
  }

  next(status?:string) {
    this.data.isCompleted = (this.data.value && this.data.value.length) ? true : false;
    this.nextCallBack.emit(status);
  }

  back() {
    this.data.isCompleted = (this.data.value && this.data.value.length) ? true : false;
    this.previousCallBack.emit('previous');
  }

  canceled() {
    console.log('cancelled')
  }
}
