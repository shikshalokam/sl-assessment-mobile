import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

/**
 * Generated class for the PieChartComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'pie-chart',
  templateUrl: 'pie-chart.html'
})
export class PieChartComponent implements OnInit {

  @Input() data;
  @Input() questionNumber;
  Highcharts = Highcharts; // required
  chartConstructor = 'chart'; // optional string, defaults to 'chart'
  updateFlag = false; // optional boolean
  oneToOneFlag = true; // optional boolean, defaults to false
  runOutsideAngular = false;
  chartObj;

  constructor() {
    console.log('Hello PieChartComponent Component');
  }

  ngOnInit() {
    this.chartObj = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: " "
      },
      tooltip: {
        // pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          // allowPointSelect: true,
          // cursor: 'pointer',
          showInLegend: true
        },
      },
      series: this.data.chart.data

    }

  }

}
