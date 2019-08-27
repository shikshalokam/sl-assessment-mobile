import { Component } from '@angular/core';

/**
 * Generated class for the BarChartComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'bar-chart',
  templateUrl: 'bar-chart.html'
})
export class BarChartComponent {

  text: string;

  constructor() {
    console.log('Hello BarChartComponent Component');
    this.text = 'Hello World';
  }

}
