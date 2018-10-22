import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { UtilsProvider } from '../../providers/utils/utils';

@Component({
  selector: 'multiple-choice-type',
  templateUrl: 'multiple-choice-type.html'
})
export class MultipleChoiceTypeComponent implements OnInit {

  text: string;
  @Input() data:any;
  @Input() isLast: boolean;
  @Input() isFirst: boolean;
  @Output() nextCallBack = new EventEmitter();
  @Output() previousCallBack = new EventEmitter()
  @Input() evidenceId: string;
  @Input() hideButton: boolean
  @Input() schoolId: string;
  
  constructor(private utils: UtilsProvider) {
    console.log('Hello checkboxTypeComponent Component');
    this.text = 'Hello World';
    // if(!this.data.value) {
    //   this.data.value = [];
    // }
  }
  ngOnInit() {
    this.data.value = this.data.value ? this.data.value : [];

  }

  updateModelValue(val) {
    if (this.data.value.indexOf(val) > -1) {
      let index = this.data.value.indexOf(val);
      this.data.value.splice(index, 1)
    } else {
      this.data.value.push(val)
    }
    console.log(this.data.value)
  }

  next(status?:string) {
    // this.utils.isQuestionComplete(this.data);
    console.log(this.utils.isQuestionComplete(this.data))
    this.data.isCompleted = this.utils.isQuestionComplete(this.data);
    this.nextCallBack.emit(status);
  }

  back() {
    this.data.isCompleted = this.utils.isQuestionComplete(this.data);
    this.previousCallBack.emit('previous');
  }

}
