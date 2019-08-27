import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ObservationReportsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-observation-reports',
  templateUrl: 'observation-reports.html',
})
export class ObservationReportsPage {

  reportObj = {
    "entityName": "Tumkur School-20",
    "observationName": "Tumukuru Flash Visit-2019 By - Leader20",
    "observationId": "5d1a002d2dfd8135bc8e1654",
    "entityType": "school",
    "entityId": "5cf12e54c8baf753f2c77362",
    "response": [
      {
        "order": "1",
        "question": "What is your name?",
        "responseType": "text",
        "answers": [
          "Kiran",
          "Deepa",
          "Akash"
        ],
        "chart": {}
      },
      {
        "order": "2",
        "question": "Do you work in Bangalore?",
        "responseType": "radio",
        "answers": [],
        "chart": {
          "type": "pie",
          "data": [
            {
              "data": [
                {
                  "name": "option1",
                  "y": 61.41,


                },
                {
                  "name": "option2",
                  "y": 11.84
                },
                {
                  "name": "option3",
                  "y": 10.85
                },
                {
                  "name": "option4",
                  "y": 4.67
                }
              ]
            }
          ]
        }
      },
      {
        "order": "3",
        "question": "Which are your favorite technologies?",
        "responseType": "multi-select",
        "answers": [],
        "chart": {
          "type": "bar",
          "data": [
            {
              "data": [
                20,
                30,
                40,
                5,
                5
              ]
            }
          ],
          "xAxis": {
            "categories": [
              "Option1",
              "option2",
              "option3",
              "option4"
            ],
            "title": {
              "text": "Responses"
            }
          },
          "yAxis": {
            "title": {
              "text": "Responses in percentage"
            }
          },


        }
      },
      {
        "order": "4",
        "question": "What is your age?",
        "responseType": "slider",
        "answers": [
          "25",
          "25",
          "28"
        ],
        "chart": {}
      }
    ]
  }
    ;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ObservationReportsPage');
  }

}
