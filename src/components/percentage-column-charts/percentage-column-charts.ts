import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

/**
/**
 * Generated class for the HighChartsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'percentage-column-charts',
  templateUrl: 'percentage-column-charts.html'
})
export class PercentageColumnChartsComponent implements OnInit {
  @Input() chartData ;
  yAxisPercent = true;
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
    this.chartData.chart.yAxis['labels'] = this.yAxisPercent ? {
      formatter: function() {
         return this.value+"%";
      }
    } :  {
      formatter: function() {
         return this.value;
      } }
      ;
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
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        floating: true,
        backgroundColor: '#FFFFFF'
    },
      plotOptions: {
        bar: {
          dataLabels: {
              enabled: true,
              color: '#FFFFFF'
          },
          showInLegend: true,
        },
        series: {
          stacking: 'percent',
          point: {
            events: {
              click: function () {
                console.log('Category: ' + this.category + ', value: ' + this.y, ',   id :' + this.entityId + '    entityType : ' + this.entityType)
              }
            }
          }
        }
      },
      series: this.chartData.chart.data
    }

  }

}
