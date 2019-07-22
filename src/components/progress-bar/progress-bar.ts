import { Component, Input } from '@angular/core';

@Component({
  selector: 'progress-bar',
  templateUrl: 'progress-bar.html'
})
export class ProgressBarComponent {

  @Input('progress') progress = 0;
  @Input('totalQuestionCount')totalQuestionCount = 0;
  @Input('completedQuestionCount')completedQuestionCount = 0;
  @Input() showQuestionTracker ;
  constructor() {
    // this.progress = 10
    console.log('Hello ProgressBarComponent Component');
  }

}
