import { Component, Input, Output , EventEmitter} from '@angular/core';

/**
 * Generated class for the RadioTypeComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'radio-type',
  templateUrl: 'radio-type.html'
})
export class RadioTypeComponent {

  @Input() data:any;
  @Input() isLast: boolean;
  @Input() isFirst: boolean;
  @Output() nextCallBack = new EventEmitter();
  @Output() previousCallBack = new EventEmitter()

  constructor() {
    console.log('Hello RadioTypeComponent Component');
  }

  next(status?:any) {
    this.data.isCompleted = this.data.value ? true : false;
    this.nextCallBack.emit(status);
  }

  back() {
    this.data.isCompleted = this.data.value ? true : false;
    this.previousCallBack.emit();
  }
}
