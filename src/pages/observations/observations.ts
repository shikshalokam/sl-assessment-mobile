import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { AppConfigs } from '../../providers/appConfig';
import { ApiProvider } from '../../providers/api/api';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { UpdateLocalSchoolDataProvider } from '../../providers/update-local-school-data/update-local-school-data';
import { EvidenceProvider } from '../../providers/evidence/evidence';
import { UtilsProvider } from '../../providers/utils/utils';
import { ProgramDetailsPage } from '../program-details/program-details';
import { MenuItemComponent } from '../../components/menu-item/menu-item';

/**
 * Generated class for the ObservationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-observations',
  templateUrl: 'observations.html',
})
export class ObservationsPage {

  programs: any;
  enableRefresh = AppConfigs.configuration.enableAssessmentListRefresh;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private apiService: ApiProvider,
    private localStorage: LocalStorageProvider,
    private ulsd: UpdateLocalSchoolDataProvider,
    private evdnsServ: EvidenceProvider,
    private popoverCtrl: PopoverController,
    private utils: UtilsProvider) {
  }

  ionViewDidLoad() {
    this.localStorage.getLocalStorage('observationsList').then(data => { 
      if (data) {
        this.programs = data;
      } else {
        this.getObservationsApi();
      }
    }).catch(error => {
      this.getObservationsApi();
    })
  }

  getObservationsApi() {
    const url = AppConfigs.cro.getObservationsList ;
    this.utils.startLoader()
    this.apiService.httpGet(url, successData => {
      this.utils.stopLoader();
      for (const program of successData.result) {
        for (const assessment of program.assessments) {
          for (const school of assessment.schools) {
            school.downloaded = false;
          }
        }
      }
      this.programs = successData.result;
      this.localStorage.setLocalStorage("observationsList", successData.result);
    }, error => {
      this.utils.stopLoader()
    })
  }

  refresh(event?: any) {
    const url = AppConfigs.cro.getObservationsList ;
    // const url = AppConfigs.survey.fetchIndividualAssessments + "?type=assessment&subType=individual&status=active";
    event ? "" : this.utils.startLoader();
    this.apiService.httpGet(url, successData => {
      const downloadedAssessments = []
      const currentPrograms = successData.result;
      for (const program of this.programs) {
        for (const assessment of program.assessments) {
          for(const school of assessment.schools){
            if (school.downloaded) {
              downloadedAssessments.push(school._id);
            }
          }
         
        }
      }
      if (!downloadedAssessments.length) {
        this.programs = successData.result;
        this.localStorage.setLocalStorage("observationsList", successData.result);
        event ? event.complete() : this.utils.stopLoader();
      } else {
        for (const program of currentPrograms) {
          for (const assessment of program.assessments) {
          for (const school of assessment.schools) {
            
            if (downloadedAssessments.indexOf(school._id) >= 0) {
              school.downloaded = true;
            }
          }
          }
        }
        this.programs = currentPrograms;
        this.localStorage.setLocalStorage("observationsList", currentPrograms);
        event ? event.complete() : this.utils.stopLoader();
      }
    }, error => {
    })
  }


  getAssessmentDetails(programIndex, assessmentIndex, schoolIndex) {
    console.log(programIndex + " " + assessmentIndex + " " + schoolIndex)
    this.utils.startLoader();
    const url = AppConfigs.cro.getObservationsDetails+this.programs[programIndex]._id+"?assessmentId="+ this.programs[programIndex].assessments[assessmentIndex].id +"&schoolId="+this.programs[programIndex].assessments[assessmentIndex].schools[schoolIndex]._id;
    console.log(url);
    this.apiService.httpGet( url, success => {
      console.log(JSON.stringify(success));
      this.programs[programIndex].assessments[assessmentIndex].schools[schoolIndex].downloaded = true;
      this.localStorage.setLocalStorage(this.utils.getAssessmentLocalStorageKey(this.programs[programIndex].assessments[assessmentIndex].schools[schoolIndex]._id), success.result);
      // this.programs[programIndex].assessments[assessmentIndex].downloaded = true;
      this.localStorage.setLocalStorage("observationsList", this.programs);
      // this.ulsd.mapSubmissionDataToQuestion(success.result);
      this.utils.stopLoader();
    }, error => {
      this.utils.stopLoader();
    })
  }

  openAction(assessment, aseessmemtData, evidenceIndex) {
    this.utils.setCurrentimageFolderName(aseessmemtData.assessments[0].evidences[evidenceIndex].externalId, assessment._id)
    const options = { _id: assessment._id, name: assessment.name, selectedEvidence: evidenceIndex, schoolDetails: aseessmemtData };
    this.evdnsServ.openActionSheet(options);
  }

  goToParentDetails() {
    this.navCtrl.push(ProgramDetailsPage)
  }


  goToEcm(assessmentId, heading) {

    this.localStorage.getLocalStorage(this.utils.getAssessmentLocalStorageKey(assessmentId)).then(successData => {
      
      console.log(successData.assessments[0].evidences.length )
    // console.log("go to ecm called");


      if (successData.assessments[0].evidences.length > 1) {

        this.navCtrl.push('EvidenceListPage', { _id: assessmentId, name: heading })

      } else {
        if (successData.assessments[0].evidences[0].startTime) {
          this.utils.setCurrentimageFolderName(successData.assessments[0].evidences[0].externalId, assessmentId)
          this.navCtrl.push('SectionListPage', { _id: assessmentId, name: heading, selectedEvidence: 0 })
        } else {
          const assessment = { _id: assessmentId, name: heading }
          this.openAction(assessment, successData, 0);
        }
      }
    }).catch(error => {
    })
  }
  openMenu(myEvent, programIndex , assessmentIndex ,schoolIndex) {
    let popover = this.popoverCtrl.create(MenuItemComponent, {
      submissionId: "",
      _id:this.programs[programIndex].assessments[assessmentIndex].schools[schoolIndex]._id,
      name: this.programs[programIndex].assessments[assessmentIndex].schools[schoolIndex]['name'],
      programId: this.programs[programIndex]._id,
      hideTeacherRegistry : false,
      hideLeaderRegistry:false,
      hideFeedback:false
    });
    popover.present({
      ev: myEvent
    });
  }
}
