import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { UtilsProvider } from '../../providers/utils/utils';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'date-type',
  templateUrl: 'date-type.html'
})
export class DateTypeComponent implements OnInit{
  @Input() data: any;
  @Input() isLast: boolean;
  @Input() isFirst: boolean;
  @Output() nextCallBack = new EventEmitter();
  @Output() previousCallBack = new EventEmitter()
  @Input() evidenceId: string;
  @Input() schoolId: string;
  @Input() imageLocalCopyId: string;


  @Input() hideButton: boolean;
  questionValid: boolean;

  constructor(private utils: UtilsProvider, private datePipe: DatePipe) {
    console.log('Hello DateTypeComponent Component');
  }

  next(status?: string) {
    this.data.isCompleted = this.utils.isQuestionComplete(this.data);
    this.nextCallBack.emit(status);
  }

  captureTime() : void {
    const parseString = this.data.dateFormat;
    console.log(this.datePipe.transform(Date.now(), 'full'));
    // this.datePipe.transform(Date.now(), 'yyyy-MM-dd')
    // this.data.value = this.datePipe.transform(Date.now(), 'full');
    this.data.value = new Date(Date.now()).toISOString();

  }

  back() {
    this.data.isCompleted = this.utils.isQuestionComplete(this.data);
    this.previousCallBack.emit('previous');
  }

  canceled() {
    console.log('cancelled')
  }

  ngOnInit() {
    this.checkForValidation();
    this.data.startTime = this.data.startTime ? this.data.startTime : Date.now();
  }

  checkForValidation(): void {
    // console.log("in")
    // console.log(JSON.stringify(this.data))
    // console.log("innn");
    this.data.isCompleted = this.utils.isQuestionComplete(this.data);
    this.data.endTime = this.questionValid ? Date.now() : "";
  }
}
