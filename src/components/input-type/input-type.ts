import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { UtilsProvider } from '../../providers/utils/utils';

@Component({
  selector: 'input-type',
  templateUrl: 'input-type.html'
})
export class InputTypeComponent implements OnInit {

  @Input() data: any;
  @Input() isLast: boolean;
  @Input() isFirst: boolean;
  @Output() nextCallBack = new EventEmitter();
  @Output() previousCallBack = new EventEmitter()
  @Input() evidenceId: string;
  @Input() hideButton: boolean
  notNumber: boolean;

  constructor(private utils: UtilsProvider) {
    console.log('Hello RadioTypeComponent Component');
  }
  ngOnInit() {
    console.log(JSON.stringify(this.data));
    this.isaNumber();
  }


  next(status?: any) {
    this.data.isCompleted = this.utils.isQuestionComplete(this.data);
    this.nextCallBack.emit(status);
  }

  isaNumber() {
    this.notNumber =  this.utils.testRegex(this.data.validation.regex, this.data.value);
  }

  back() {
    this.data.isCompleted = this.utils.isQuestionComplete(this.data);
    this.previousCallBack.emit('previous');
  }

}
