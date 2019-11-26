import { Component , Input} from '@angular/core';

/**
 * Generated class for the MatrixChartComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'matrix-chart',
  templateUrl: 'matrix-chart.html'
})
export class MatrixChartComponent {

  @Input() data;
  @Input() questionNumber;

  constructor() {
    console.log('Hello MatrixChartComponent Component');
  }

}