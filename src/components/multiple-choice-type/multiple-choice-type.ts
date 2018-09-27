import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'multiple-choice-type',
  templateUrl: 'multiple-choice-type.html'
})
export class MultipleChoiceTypeComponent implements OnInit {

  text: string;
  @Input() data:any;
  @Input() isLast: boolean;
  @Output() nextCallBack = new EventEmitter();
  @Output() previousCallBack = new EventEmitter()

  constructor() {
    console.log('Hello checkboxTypeComponent Component');
    this.text = 'Hello World';
    // if(!this.data.value) {
    //   this.data.value = [];
    // }
  }
  ngOnInit() {
    // console.log(JSON.stringify(this.data))
    // this.data.value = ['R1']
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
    this.data.isCompleted = (this.data.value && this.data.value.length) ? true : false;
    this.nextCallBack.emit(status);
  }

  back() {
    this.data.isCompleted = (this.data.value && this.data.value.length) ? true : false;
    this.previousCallBack.emit('previous');
  }

}
