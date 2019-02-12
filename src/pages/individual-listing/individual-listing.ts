import { Component } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { AppConfigs } from '../../providers/appConfig';
import { UtilsProvider } from '../../providers/utils/utils';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { EvidenceProvider } from '../../providers/evidence/evidence';
import { ProgramDetailsPage } from '../program-details/program-details';

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
    private appCntrl: App,
    private evdnsServ:EvidenceProvider,
    private utils: UtilsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IndividualListingPage');
    this.localStorage.getLocalStorage('assessmentList').then(data => {
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
      this.localStorage.setLocalStorage("assessmentList", successData.result)
    }, error => {
      console.log("error")
      this.utils.stopLoader()
    })
  }

  getAssessmentDetails(programIndex, assessmentIndex) {
    this.utils.startLoader();
    this.apiService.httpGet(AppConfigs.survey.fetchAssessmentDetails + this.programs[programIndex].externalId + "?assessmentId=" + this.programs[programIndex].assessments[assessmentIndex].id, success => {
      this.localStorage.setLocalStorage("assessmentDetails_" + this.programs[programIndex].assessments[assessmentIndex].id, success.result);
      this.programs[programIndex].assessments[assessmentIndex].downloaded = true;
      this.localStorage.setLocalStorage("assessmentList", this.programs)
      this.utils.stopLoader();
    }, error => {
      this.utils.stopLoader();
    })
  }

  openAction(assessment,aseessmemtData, evidenceIndex) {
    this.utils.setCurrentimageFolderName(aseessmemtData.assessments.evidences[evidenceIndex].externalId, assessment._id)
    const options = { _id: assessment._id, name: assessment.name, selectedEvidence: evidenceIndex, schoolDetails: aseessmemtData };
    this.evdnsServ.openActionSheet(options);
  }

  goToParentDetails() {
    this.navCtrl.push(ProgramDetailsPage)
  }


  goToEcm(assessmentId, heading) {
    console.log("goToEcm " + assessmentId)
    this.localStorage.getLocalStorage("assessmentDetails_" + assessmentId).then(successData => {
      console.log("innn " + successData.assessments.evidences.length)
      if (successData.assessments.evidences.length > 1) {
        this.navCtrl.push('EvidenceListPage', { _id: assessmentId, name: heading })

      } else {
        console.log("innnnnn hiiiiii")
        if (successData.assessments.evidences[0].startTime) {
          this.utils.setCurrentimageFolderName(successData.assessments.evidences[0].externalId, assessmentId)
          this.navCtrl.push('SectionListPage', { _id: assessmentId, name: heading, selectedEvidence: 0 })
        } else {
          const assessment = {_id: assessmentId, name: heading}
          this.openAction(assessment, successData, 0);
        }
        // this.navCtrl.push('SectionListPage', { _id: assessmentId, name: heading, selectedEvidence: 0 });
        // this.appCtrl.getRootNav().push('EvidenceListPage', { _id: school._id, name: school.name, parent: this })
        // this.appCntrl.getRootNav().push('EvidenceListPage', { _id: assessmentId, name: "Example", parent: this  })
      }
    }).catch(error => {
    })
  }

}
