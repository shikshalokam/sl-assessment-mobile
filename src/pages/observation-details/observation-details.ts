import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { AssessmentServiceProvider } from '../../providers/assessment-service/assessment-service';
import { UtilsProvider } from '../../providers/utils/utils';
import { EvidenceProvider } from '../../providers/evidence/evidence';
import { ApiProvider } from '../../providers/api/api';
import { AppConfigs } from '../../providers/appConfig';

@Component({
  selector: 'page-observation-details',
  templateUrl: 'observation-details.html',
})
export class ObservationDetailsPage {

  observationDetails = [];
  programs: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private assessmentService: AssessmentServiceProvider,
    private utils: UtilsProvider,
    private evdnsServ: EvidenceProvider,
    private apiProvider : ApiProvider,
    private localStorage: LocalStorageProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ObservationDetailsPage');
    const selectedObservationIndex = this.navParams.get('selectedObservationIndex');
    this.localStorage.getLocalStorage('createdObservationList').then(data => {
      this.programs = data;
      console.log(JSON.stringify(data))
      this.observationDetails.push(data[selectedObservationIndex]);
    }).catch(error => {
    })
  }

  markAsComplete() {
    this.apiProvider.httpGet(AppConfigs.cro.markAsComplete+this.programs[this.navParams.get('selectedObservationIndex')]._id , success =>{
      this.programs[this.navParams.get('selectedObservationIndex')].status = "completed"
      this.localStorage.setLocalStorage('createdObservationList',this.programs);
      this.utils.openToast(success.message,'ok');
      this.navCtrl.pop();
    },error =>{

    })
  }
  

  getAssessmentDetails(event) {
    event.observationIndex = this.navParams.get('selectedObservationIndex');
    this.assessmentService.getAssessmentDetailsOfCreatedObservation(event, this.programs, 'createdObservationList').then(program => {
      this.programs = program;
      this.goToEcm(this.navParams.get('selectedObservationIndex'), event, program);
    }).catch(error => {

    })
  }

  goToEcm(observationIndex, event, program) {
    let submissionId = program[observationIndex]['entities'][event.entityIndex].submissionId
    let heading = program[observationIndex]['entities'][event.entityIndex].name;
    this.localStorage.getLocalStorage(this.utils.getAssessmentLocalStorageKey(submissionId)).then(successData => {
      if (successData.assessment.evidences.length > 1) {
        this.navCtrl.push('EvidenceListPage', { _id: submissionId, name: heading })
      } else {
        if (successData.assessment.evidences[0].startTime) {
          this.utils.setCurrentimageFolderName(successData.assessment.evidences[0].externalId, submissionId)
          this.navCtrl.push('SectionListPage', { _id: submissionId, name: heading, selectedEvidence: 0 })
        } else {
          const assessment = { _id: submissionId, name: heading }
          this.openAction(assessment, successData, 0);
        }
      }
    }).catch(error => {
    });

  }
  openAction(assessment, aseessmemtData, evidenceIndex) {
    // console.log("open action ")
    this.utils.setCurrentimageFolderName(aseessmemtData.assessment.evidences[evidenceIndex].externalId, assessment._id)
    const options = { _id: assessment._id, name: assessment.name, selectedEvidence: evidenceIndex, entityDetails: aseessmemtData };
    this.evdnsServ.openActionSheet(options);
  }
  updateLocalStorage(event) {

    this.localStorage.getLocalStorage('createdObservationList').then(data => {
      event.length ?
        data[this.navParams.get('selectedObservationIndex')].entities = event
        :
        data[this.navParams.get('selectedObservationIndex')].entities.splice(event, 1);


      this.localStorage.setLocalStorage('createdObservationList', data);
    }).catch(error => {

    });
  }

  

}
