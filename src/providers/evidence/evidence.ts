import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActionSheetController, App, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UtilsProvider } from '../utils/utils';
import { Diagnostic } from '@ionic-native/diagnostic';
import { NetworkGpsProvider } from '../network-gps/network-gps';
import { AppConfigs } from '../appConfig';
import { ApiProvider } from '../api/api';

/*
  Generated class for the EvidenceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EvidenceProvider {
  schoolData: any;
  schoolDetails: any;
  schoolId: any;
  evidenceIndex: any;

  constructor(public http: HttpClient, private actionSheet: ActionSheetController,
    private appCtrl: App, private storage: Storage, private utils: UtilsProvider,
    private diagnostic: Diagnostic, private netwrkGpsProvider: NetworkGpsProvider,
    private apiService: ApiProvider, private alertCtrl: AlertController) {
    console.log('Hello EvidenceProvider Provider');
    this.storage.get('schools').then(data => {
      this.schoolData = data;
    })
  }

  openActionSheet(params): void {
    this.schoolDetails = params.schoolDetails;
    this.schoolId = params._id;
    this.evidenceIndex = params.selectedEvidence;
    const selectedECM = this.schoolDetails[this.schoolId]['assessments'][0]['evidences'][this.evidenceIndex];

    let action = this.actionSheet.create({
      title: "Survey actions",
      buttons: [
        {
          text: "View Survey",
          icon: "eye",
          handler: () => {
            delete params.schoolDetails;
            this.appCtrl.getRootNav().push('SectionListPage', params);
          }
        },
        {
          text: "Start Survey",
          icon: 'arrow-forward',
          handler: () => {
            this.diagnostic.isLocationEnabled().then(success => {
              if (success) {
                params.schoolDetails[params._id]['assessments'][0]['evidences'][params.selectedEvidence].startTime = Date.now();
                this.utils.setLocalSchoolData(params.schoolDetails);
                delete params.schoolDetails;
                this.appCtrl.getRootNav().push('SectionListPage', params);
              } else {
                this.netwrkGpsProvider.checkForLocationPermissions();
              }
            }).catch(error => {
              this.netwrkGpsProvider.checkForLocationPermissions();
            })
          }
        },
        {
          text: selectedECM.canBeNotApplicable ? "ECM Not Applicable" : 'Cancel',
          role: !selectedECM.canBeNotApplicable ? 'destructive' : "",
          icon: selectedECM.canBeNotApplicable ? "alert" : "",
          handler: () => {
            if (selectedECM.canBeNotApplicable) {
              this.openAlert(selectedECM);
              // this.notApplicable(selectedECM);
            }
          }
        }
      ]
    })
    // if(selectedECM.canBeNotApplicable) {
    //   action['buttons'].push(
    // {
    //   text: "ECM Not Applicable",
    //   icon: "alert",
    //   handler: () => {
    //     this.notApplicable(params);
    //   }
    // }
    //   )
    // }
    action.present();
  }

  openAlert(selectedECM): void {
    let alert = this.alertCtrl.create({
      title: 'Confirm ',
      message: 'Do you want mark ECM as not applicable?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            // console.log('Buy clicked');
            this.notApplicable(selectedECM);
          }
        }
      ]
    });
    alert.present();
  }

  notApplicable(selectedECM) {
    this.utils.startLoader()
    const payload = this.constructPayload(selectedECM);
    const submissionId = this.schoolDetails[this.schoolId]['assessments'][0].submissionId;
    const url = AppConfigs.survey.submission + submissionId;
    this.apiService.httpPost(url, payload, response => {
      console.log(JSON.stringify(response));
      this.utils.openToast(response.message);
      this.schoolDetails[this.schoolId]['assessments'][0]['evidences'][this.evidenceIndex].isSubmitted = true;
      this.schoolDetails[this.schoolId]['assessments'][0]['evidences'][this.evidenceIndex].notApplicable = true;
      this.utils.setLocalSchoolData(this.schoolDetails);
      this.utils.stopLoader();

    }, error => {
      this.utils.stopLoader();
    })
  }

  constructPayload(selectedECM): any {
    console.log("in construct")
    const payload = {
      // 'schoolProfile': {},
      'evidence': {}
    }
    // const schoolProfile = {};
    const evidence = {
      id: "",
      externalId: "",
      answers: {},
      startTime: 0,
      endTime: 0,
      notApplicable: true
    };

    const currentEvidence = selectedECM;
    evidence.id = currentEvidence._id;
    evidence.externalId = currentEvidence.externalId;
    evidence.startTime = currentEvidence.startTime;
    evidence.endTime = Date.now();
    for (const section of selectedECM.sections) {
      for (const question of section.questions) {
        let obj = {
          qid: question._id,
          value: question.responseType === 'matrix' ? this.constructMatrixObject(question) : question.value,
          remarks: question.remarks,
          fileName: question.fileName,
          notApplicable: true,
          payload: {
            question: question.question,
            labels: [],
            responseType: question.responseType,
            // notApplicable: true,
          }
        };
        // if (question.responseType === 'multiselect') {
        //   for (const val of question.value) {
        //     for (const option of question.options) {
        //       if (val === option.value && obj.payload.labels.indexOf(option.label) <= 0) {
        //         obj.payload.labels.push(option.label);
        //       }
        //     }
        //   }

        // } else if (question.responseType === 'radio') {
        //   for (const option of question.options) {
        //     if (obj.value === option.value && obj.payload.labels.indexOf(option.label) <= 0) {
        //       obj.payload.labels.push(option.label);
        //     }
        //   }
        // } else {
        //   obj.payload.labels.push(question.value);
        // }

        for (const key of Object.keys(question.payload)) {
          obj[key] = question.payload[key];
        }
        evidence.answers[obj.qid] = obj;
      }
    }
    // payload.schoolProfile = schoolProfile;
    payload.evidence = evidence;
    return payload
  }

  constructMatrixObject(question) {
    const value = [];
    for (const instance of question.value) {
      let eachInstance = {};
      for (let qst of instance) {
        const obj1 = {
          qid: qst._id,
          value: qst.value,
          remarks: qst.remarks,
          fileName: qst.fileName,
          notApplicable: true,
          payload: {
            question: qst.question,
            labels: [],
            responseType: qst.responseType
          }
        }
        // if (qst.responseType === 'multiselect') {
        //   for (const val of qst.value) {
        //     for (const option of qst.options) {
        //       if (val === option.value && obj1.payload.labels.indexOf(option.label) <= 0) {
        //         obj1.payload.labels.push(option.label);
        //       }
        //     }
        //   }

        // } else if (qst.responseType === 'radio') {
        //   for (const option of qst.options) {
        //     if (obj1.value === option.value && obj1.payload.labels.indexOf(option.label) <= 0) {
        //       obj1.payload.labels.push(option.label);
        //     }
        //   }
        // } else {
        //   obj1.payload.labels.push(qst.value);
        // }

        for (const key of Object.keys(qst.payload)) {
          obj1[key] = qst.payload[key];
        }
        eachInstance[obj1.qid] = obj1;
      }
      value.push(eachInstance)
    }
    return value
  }


}
