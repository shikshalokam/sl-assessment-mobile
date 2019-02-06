import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { AppConfigs } from '../../providers/appConfig';
import { UtilsProvider } from '../../providers/utils/utils';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';

// @IonicPage()
@Component({
  selector: 'page-individual-listing',
  templateUrl: 'individual-listing.html',
})
export class IndividualListingPage {

  programs: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private apiService: ApiProvider,
    private localStorage: LocalStorageProvider,
    private utils: UtilsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IndividualListingPage');
    this.localStorage.getLocalStorage('individualAssessmentList').then(data => {
    console.log("in localstorage")

      if (data) {
        this.programs = data;
      } else {
        this.getAssessmentsApi();
      }
    }).catch(error => {
      this.getAssessmentsApi();
    })
  }

  getAssessmentsApi() {
    console.log("in api")
    const url = AppConfigs.survey.fetchIndividualAssessments + "?type=assessment&subType=individual&status=active";
    this.utils.startLoader()
    this.apiService.httpGet(url, successData => {
      this.utils.stopLoader();
      this.programs = successData.result;
      this.localStorage.setLocalStorage("individualAssessmentList", successData.result)
    }, error => {
      console.log("error")
      this.utils.stopLoader()
    })
  }

  getAssessmentDetails(programIndex, assessmentIndex) {
    this.utils.startLoader()
    this.apiService.httpGet(AppConfigs.survey.fetchAssessmentDetails+this.programs[programIndex].externalId+"?assessmentId="+this.programs[programIndex].assessments[assessmentIndex].id, success => {
      this.localStorage.setLocalStorage("individualAssessment_"+this.programs[programIndex].externalId +"_"+this.programs[programIndex].assessments[assessmentIndex].id, success.result);
      this.programs[programIndex].assessments[assessmentIndex].downloaded = true;
      this.localStorage.setLocalStorage("individualAssessmentList", this.programs)
      this.utils.stopLoader();
      console.log("successs")
    }, error => {
      this.utils.stopLoader();
    })
  }

}
