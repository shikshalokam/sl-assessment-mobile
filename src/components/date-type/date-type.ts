import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UtilsProvider } from '../../providers/utils/utils';


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
  @Input() evidenceId: string;
  @Input() schoolId: string;

  @Input() hideButton: boolean;

  constructor(private utils: UtilsProvider) {
    console.log('Hello DateTypeComponent Component');
  }

  next(status?: string) {
    this.data.isCompleted = this.utils.isQuestionComplete(this.data);
    this.nextCallBack.emit(status);
  }

  back() {
    this.data.isCompleted = this.utils.isQuestionComplete(this.data);
    this.previousCallBack.emit('previous');
  }

  canceled() {
    console.log('cancelled')
  }
}
