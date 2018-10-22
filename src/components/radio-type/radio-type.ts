import { Component, Input, Output , EventEmitter, OnInit} from '@angular/core';
import { UtilsProvider } from '../../providers/utils/utils';

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
export class RadioTypeComponent implements OnInit{

  @Input() data:any;
  @Input() isLast: boolean;
  @Input() isFirst: boolean;
  @Output() nextCallBack = new EventEmitter();
  @Output() previousCallBack = new EventEmitter()
  @Input() evidenceId: string;
  @Input() hideButton: boolean;
  @Input() schoolId: string;

  color: string = 'light';
  isComplete: boolean;

  constructor(private utils: UtilsProvider) {

    console.log('Hello RadioTypeComponent Component');
    console.log("Evidence id"+ this.evidenceId)

  }

  ngOnInit() {
    // console.log(JSON.stringify(this.data))
  }

  checkForCompletion() {

  }

  next(status?:any) {
    this.data.isCompleted = this.utils.isQuestionComplete(this.data);
    this.nextCallBack.emit(status);
  }

  back() {
    this.data.isCompleted = this.utils.isQuestionComplete(this.data);
    this.previousCallBack.emit();
  }
}
