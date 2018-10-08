import { Component, Input } from '@angular/core';

@Component({
  selector: 'remarks',
  templateUrl: 'remarks.html'
})
export class RemarksComponent {

  @Input() data: any;

  constructor() {
    console.log('Hello RemarksComponent Component');
  }

}
