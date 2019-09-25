import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import * as Highcharts from 'highcharts';

/**
/**
 * Generated class for the HighChartsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'high-charts',
  templateUrl: 'high-charts.html'
})
export class HighChartsComponent implements OnInit {
  @Output()clickOnGraphEventEmit = new EventEmitter();
  @Input() chartData ;
  // @Input() chartData = {
  //   order: 1,
  //   chart: {
  //     type: "bar",
  //     // renderTo:'container',
  //     stacking: "percent",
  //     title: "Criteria vs level mapping aggregated at domain level",
  //     xAxis: {
  //       categories: [
  //         "Domain 1",
  //         "Domain 2",
  //         "Domain 3",
  //         "Domain 4",
  //         "Domain 5"
  //       ],
  //       title: ""
  //     },
  //     yAxis: {
  //       title: {
  //         text: "Criteria"
  //       }
  //     },
  //     data: [
  //       {
  //         name: "LEvel 1",
  //         data: [
  //           5,
  //           3,
  //           4,
  //           7,
  //           2
  //         ]
  //       },
  //       {
  //         name: "Level 2",
  //         data: [
  //           2,
  //           2,
  //           3,
  //           2,
  //           1
  //         ]
  //       },
  //       {
  //         name: "LEvel 3",
  //         data: [
  //           3,
  //           4,
  //           4,
  //           2,
  //           5
  //         ]
  //       }
  //     ]
  //   }
  // };
  Highcharts = Highcharts; // required
  chartConstructor = 'chart'; // optional string, defaults to 'chart'
  updateFlag = false; // optional boolean
  oneToOneFlag = true; // optional boolean, defaults to false
  runOutsideAngular = false;
  chartObj;

  constructor() {
    console.log('Hello BarChartComponent Component');
  }

  ngOnInit() {
    this.chartObj = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: this.chartData.chart.type
      },
      title: {
        text: this.chartData.chart.title
      },
      xAxis: this.chartData.chart.xAxis,
      yAxis: this.chartData.chart.yAxis,
      tooltip: {
        // pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          },
          showInLegend: true
        },
        series: {
          stacking: 'percent',
          point: {
            events: {
              click: this.onPointClick.bind(this)
              
            }
          }
        }
      },
      series: this.chartData.chart.data
    }

  }

  onPointClick = (event) => { 
    // console.log(JSON.stringify(event.point.options))
    // console.log('Category: ' + event.category + ', value: ' + event.entityId)
    event.point.options['nextChildEntityType'] = this.chartData.chart.nextChildEntityType;
    event.point.options['grandChildEntityType'] = this.chartData.chart.grandChildEntityType
    this.chartData.chart.nextChildEntityType == "" ? null :
    this.clickOnGraphEventEmit.emit(event.point.options)
  }
}
