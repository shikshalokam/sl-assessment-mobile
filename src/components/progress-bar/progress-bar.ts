import { Component, Input } from '@angular/core';

@Component({
  selector: 'progress-bar',
  templateUrl: 'progress-bar.html'
})
export class ProgressBarComponent {

  @Input('progress') progress = 0;

  constructor() {
    // this.progress = 10
    console.log('Hello ProgressBarComponent Component');
  }

}
