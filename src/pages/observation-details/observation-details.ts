import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Events, Platform } from 'ionic-angular';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { AssessmentServiceProvider } from '../../providers/assessment-service/assessment-service';
import { UtilsProvider } from '../../providers/utils/utils';
import { EvidenceProvider } from '../../providers/evidence/evidence';
import { ApiProvider } from '../../providers/api/api';
import { AppConfigs } from '../../providers/appConfig';
import { TranslateService } from '@ngx-translate/core';
import { SubmissionListPage } from '../submission-list/submission-list';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { DownloadAndPreviewProvider } from '../../providers/download-and-preview/download-and-preview';

declare var cordova: any;


@Component({
  selector: 'page-observation-details',
  templateUrl: 'observation-details.html',
})
export class ObservationDetailsPage {

  observationDetails = [];
  programs: any;
  enableCompleteBtn: boolean;
  selectedObservationIndex: any;
  isIos: boolean;
  appFolderPath;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCntrl: AlertController,
    private assessmentService: AssessmentServiceProvider,
    private utils: UtilsProvider,
    private evdnsServ: EvidenceProvider,
    private translate: TranslateService,
    private apiProvider: ApiProvider,
    private localStorage: LocalStorageProvider,
    private fileTransfr: FileTransfer,
    private platform: Platform,
    private dap: DownloadAndPreviewProvider,
    private events: Events) {

    this.events.subscribe('observationLocalstorageUpdated', success => {
      this.getLocalStorageData();
    })
  }

  ionViewDidLoad() {
    this.selectedObservationIndex = this.navParams.get('selectedObservationIndex');

    console.log('ionViewDidLoad ObservationDetailsPage');
    this.getLocalStorageData();
    this.isIos = this.platform.is('ios') ? true : false;
    this.appFolderPath = this.isIos ? cordova.file.documentsDirectory + 'submissionDocs' : cordova.file.externalDataDirectory + 'submissionDocs';
  }

  ionViewWillEnter() {
    console.log("On view enter")
  }

  getLocalStorageData() {
    this.observationDetails = [];
    this.localStorage.getLocalStorage('createdObservationList').then(data => {
      this.programs = data;
      this.observationDetails.push(data[this.selectedObservationIndex]);
      this.enableCompleteBtn = this.isAllEntitysCompleted();
    }).catch(error => {
    })
  }


  isAllEntitysCompleted() {
    let completed = true;
    for (const entity of this.observationDetails[0]['entities']) {
      if (entity.submissionStatus !== 'completed') {
        return false
      }
    }
    return completed
  }

  markAsComplete() {
    let translateObject;
    this.translate.get(['actionSheet.confirm', 'actionSheet.completeobservation', 'actionSheet.restrictAction', 'actionSheet.no', 'actionSheet.yes']).subscribe(translations => {
      translateObject = translations;
      console.log(JSON.stringify(translations))
    })
    let alert = this.alertCntrl.create({
      title: translateObject['actionSheet.confirm'],
      message: translateObject['actionSheet.completeobservation'] + `<br>` +
        translateObject['actionSheet.restrictAction'],
      buttons: [
        {
          text: translateObject['actionSheet.no'],
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: translateObject['actionSheet.yes'],
          handler: () => {
            console.log(this.programs[this.navParams.get('selectedObservationIndex')]._id);

            this.apiProvider.httpGet(AppConfigs.cro.markAsComplete + this.programs[this.navParams.get('selectedObservationIndex')]._id, success => {
              this.programs[this.navParams.get('selectedObservationIndex')].status = "completed"
              this.localStorage.setLocalStorage('createdObservationList', this.programs);
              this.translate.get('toastMessage.ok').subscribe(translations => {
                this.utils.openToast(success.message, translations);
              })
              this.navCtrl.pop();
            }, error => {

            })
          }
        }]
    });
    alert.present();
  }


  getAssessmentDetails(event) {
    // console.log("getting assessment details")
    event.observationIndex = this.navParams.get('selectedObservationIndex');
    // console.log(this.observationDetails[event.programIndex].entities[event.entityIndex].submissions.length)
    this.assessmentService.getAssessmentDetailsOfCreatedObservation(event, this.programs, 'createdObservationList').then(program => {
      this.programs = program;
      // console.log(JSON.stringify(program))

      this.goToEcm(this.navParams.get('selectedObservationIndex'), event, program)
    }).catch(error => {

    })
  }
  goToSubmissionListPage(observationIndex, entityIndex) {
    this.navCtrl.push(SubmissionListPage, { observationIndex: observationIndex, entityIndex: entityIndex, selectedObservationIndex: this.navParams.get('selectedObservationIndex') })
  }

  goToEcm(observationIndex, event, program) {
    console.log("Assesment details")
    let submissionId = program[observationIndex]['entities'][event.entityIndex].submissionId
    let heading = program[observationIndex]['entities'][event.entityIndex].name;
    if (this.observationDetails[event.programIndex].entities[event.entityIndex].submissions && this.observationDetails[event.programIndex].entities[event.entityIndex].submissions.length > 0) {
      this.goToSubmissionListPage(event.programIndex, event.entityIndex)
    } else {
      console.log(this.observationDetails[event.programIndex].entities[event.entityIndex].submissions.length)
      this.localStorage.getLocalStorage(this.utils.getAssessmentLocalStorageKey(submissionId)).then(successData => {
        // console.log(JSON.stringify(successData.assessment))
        if (successData.assessment.evidences.length > 1) {
          this.navCtrl.push('EvidenceListPage', { _id: submissionId, name: heading })
        } else {
          //   if (this.observationDetails[event.programIndex].entities[event.entityIndex].submissions.length > 0 ){
          //   this.goToSubmissionListPage(event.programIndex,event.entityIndex)
          // }else {
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

  }
  openAction(assessment, aseessmemtData, evidenceIndex) {
    // console.log(JSON.stringify(assessment))

    this.utils.setCurrentimageFolderName(aseessmemtData.assessment.evidences[evidenceIndex].externalId, assessment._id)
    const options = { _id: assessment._id, name: assessment.name, selectedEvidence: evidenceIndex, entityDetails: aseessmemtData };
    this.evdnsServ.openActionSheet(options, "Observation");

  }
  updateLocalStorage() {
    this.localStorage.getLocalStorage('createdObservationList').then(data => {
      data[this.navParams.get('selectedObservationIndex')] = this.observationDetails[0]
      this.localStorage.setLocalStorage('createdObservationList', data);
      this.getLocalStorageData();
    }).catch(error => {

    });
  }

  getSubmissionPdf(submissionId, action) {
    this.apiProvider.httpGet(AppConfigs.cro.getSubmissionPdf+submissionId, success => {
      if(success.result.url){

      }else {
        this.utils.openToast(success.message);
      }
      console.log(JSON.stringify(success))
    }, error => {
      console.log(JSON.stringify(error))
    })
  }

  downloadFile(url) {
    const fileTransfer: FileTransferObject = this.fileTransfr.create();
    fileTransfer.download(url,this.appFolderPath + '/submissionDoc_'+".pdf").then(success => {
      console.log(JSON.stringify(success))
    }).catch(error => {
      console.log(JSON.stringify(error))
    })

  }

  doActions(event){
    console.log(JSON.stringify(event));
    this.dap.checkForSubmissionDoc(event.submissionId, event.action)
    // this.getSubmissionPdf(event.submissionId, event.action);

    // this.downloadFile("http://www.africau.edu/images/default/sample.pdf")
  }



}
