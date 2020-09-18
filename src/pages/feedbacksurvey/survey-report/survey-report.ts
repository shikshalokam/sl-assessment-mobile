import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../../providers/api/api';
import { AppConfigs } from '../../../providers/appConfig';

/**
 * Generated class for the SurveyReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: "page-survey-report",
  templateUrl: "survey-report.html",
})
export class SurveyReportPage {
  submissionId: any;
  solutionId: any;
  reportObj: any;
  error: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public apiService:ApiProvider) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad SurveyReportPage");
    this.submissionId = this.navParams.get("submissionId");
    this.solutionId = this.navParams.get("solutionId");
    this.getObservationReports();
  }
  getObservationReports() {
    let url
    if (this.submissionId) {
      
       url = AppConfigs.surveyFeedback.submissionReport + this.submissionId
    } else {
      url = AppConfigs.surveyFeedback.solutionReport + this.solutionId;
      
    }
    this.apiService.httpGet(
      url,

      (success) => {
        //this will be initialized only on page load
        
        if (success.result==false) {
          this.error = success.message;
        } else {
          this.reportObj = success;
        }

        // this.utils.stopLoader();
        
      },
      (error) => {
        this.error = "No data found";
        // this.utils.stopLoader();
      },
      {
        baseUrl: "dhiti",
        version: "v1",
      }
    );
  }
}
