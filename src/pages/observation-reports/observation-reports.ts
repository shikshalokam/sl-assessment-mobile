import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { AppConfigs } from '../../providers/appConfig';
import { File } from '@ionic-native/file';
import { DownloadAndPreviewProvider } from '../../providers/download-and-preview/download-and-preview';

declare var cordova: any;
@Component({
  selector: 'page-observation-reports',
  templateUrl: 'observation-reports.html',
})
export class ObservationReportsPage {

  reportObj;
  submissionId;
  observationId;
  entityId;
  error;
  payload;
  appFolderPath;
  isIos;
  fileName;
  action;

  constructor(public navCtrl: NavController, private dap: DownloadAndPreviewProvider,
    public navParams: NavParams, private platform: Platform,
    private apiService: ApiProvider, private file: File) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ObservationReportsPage');
    this.submissionId = this.navParams.get('submissionId');
    this.observationId = this.navParams.get('observationId')
    this.entityId = this.navParams.get('entityId');
    this.payload = {
      "entityId": this.entityId,
      "submissionId": this.submissionId,
      "observationId": this.observationId
    }
    this.isIos = this.platform.is('ios') ? true : false;
    this.appFolderPath = this.isIos ? cordova.file.documentsDirectory + 'submissionDocs' : cordova.file.externalDataDirectory + 'submissionDocs';

    this.getObservationReports();

  }

  getObservationReports(download = false) {
    let url;
    if (this.submissionId) {
      url = AppConfigs.observationReports.instanceReport;
      this.fileName = this.submissionId;
    } else if (!this.submissionId && !this.entityId) {
      url = AppConfigs.observationReports.observationReport;
      this.fileName = this.observationId;
    } else {
      url = AppConfigs.observationReports.entityReport
      this.fileName = this.entityId + '_' + this.observationId;
    }

    this.apiService.httpPost(url, this.payload, (success) => {
      if (success) {
        if (download) {

        } else {
          this.reportObj = success;
        }
      } else {
        this.error = "No data found"
      }
    }, error => {
      this.error = "No data found"
    }, true)

  }

  downloadSharePdf(action) {
    this,action = action;
    this.checkForSubmissionDoc(this.fileName)
  }

  checkForSubmissionDoc(submissionId) {
    console.log("Check for file")
    const fileName = "report_" + submissionId + ".pdf";
    this.file.checkFile(this.appFolderPath + '/', fileName).then(success => {
      console.log("Check for file available")
      this.action === 'share' ? this.dap.shareSubmissionDoc(this.appFolderPath + '/' + fileName) : this.dap.previewSubmissionDoc(fileName)
    }).catch(error => {
      console.log("Check for file not available")
      this.getObservationReports(true)
    })
  }

}
