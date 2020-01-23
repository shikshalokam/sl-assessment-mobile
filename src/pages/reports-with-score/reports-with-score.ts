import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { AppConfigs } from '../../providers/appConfig';
import { File } from '@ionic-native/file';
import { DownloadAndPreviewProvider } from '../../providers/download-and-preview/download-and-preview';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { UtilsProvider } from '../../providers/utils/utils';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { DatePipe } from '@angular/common';
declare var cordova: any;
/**
 * Generated class for the ReportsWithScorePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reports-with-score',
  templateUrl: 'reports-with-score.html',
})
export class ReportsWithScorePage {
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
  solutionId: string;
  entityType: string;

  constructor(public navCtrl: NavController, private dap: DownloadAndPreviewProvider,
    public navParams: NavParams, private platform: Platform,
    private fileTransfer: FileTransfer, private utils: UtilsProvider,
    private androidPermissions: AndroidPermissions,
    private datepipe: DatePipe,
    private apiService: ApiProvider, private file: File) {
  }

  ionViewDidEnter() {
    this.submissionId = this.navParams.get('submissionId');
    this.observationId = this.navParams.get('observationId')
    this.entityId = this.navParams.get('entityId');
    this.solutionId = this.navParams.get('solutionId');
    this.entityType = this.navParams.get('entityType');
    this.payload = {
      "entityId": this.entityId,
      "submissionId": this.submissionId,
      "observationId": this.observationId
    }
    console.log(this.payload, "payload");
    this.isIos = this.platform.is('ios') ? true : false;
    this.appFolderPath = this.isIos ? cordova.file.documentsDirectory + '/Download/' : cordova.file.externalRootDirectory + '/Download/';
    // this.appFolderPath = this.isIos ? cordova.file.externalRootDirectory + '/Download/' : cordova.file.externalRootDirectory + '/Download/';
    this.getObservationReports();
  }

  getObservationReports(download = false) {
    this.utils.startLoader();
    let url;
    if (this.solutionId) {
      this.payload.solutionId = this.solutionId;
      this.payload.entityType = this.entityType;
      url = AppConfigs.observationReportsWithScore.solutionReport;
    } else if (this.submissionId) {
      // view submission report
      url = AppConfigs.observationReportsWithScore.instanceReport;
    } else if (this.observationId && this.entityId) {
      // view entity report
      url = AppConfigs.observationReportsWithScore.entityReport;
    } else {
      url = AppConfigs.observationReportsWithScore.observationReport;
    }
    this.apiService.httpPost(url, this.payload, (success) => {
      if (success) {
        this.reportObj = success;
      } else {
        this.error = "No data found";
        this.utils.openToast(this.error)
      }
      this.utils.stopLoader();
    }, error => {
      this.error = "No data found";
      this.utils.openToast(error.message)
      this.utils.stopLoader();
    }, { baseUrl: "dhiti" })
  }

  downloadSharePdf(action) {
    this.action = action;
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(status => {
      if (status.hasPermission) {
        this.getObservationReportUrl()
      } else {
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(success => {
          if (success.hasPermission) {
            this.getObservationReportUrl()
          }
        }).catch(error => {
        })
      }
    })
  }
  getObservationReportUrl() {
    this.utils.startLoader();
    // + "type=submission&"
    let url = AppConfigs.observationReportsWithScore.getReportsPdfUrls;
    const timeStamp = '_' + this.datepipe.transform(new Date(), 'yyyy-MMM-dd-HH-mm-ss a');
    if (this.solutionId) {
      this.fileName = this.solutionId + timeStamp + ".pdf";
    } else if (this.submissionId) {
      this.fileName = this.submissionId + timeStamp + ".pdf";
    } else if (this.observationId && this.entityId) {
      this.fileName = this.observationId + `_${this.entityId}_` + timeStamp + ".pdf";
    } else if (this.observationId) {
      this.fileName = this.observationId + timeStamp + ".pdf";
    }
    this.apiService.httpPost(url, this.payload, (success) => {
      this.utils.stopLoader();
      if (success.status === 'success' && success.pdfUrl) {
        this.downloadSubmissionDoc(success.pdfUrl);
      } else {
        this.utils.openToast(success.message)
      }
      this.utils.stopLoader();
    }, error => {
      this.error = "No data found";
      this.utils.stopLoader();
    }, { baseUrl: "dhiti" })
  }
  downloadSubmissionDoc(fileRemoteUrl) {
    this.utils.startLoader();
    if (this.isIos) {
      this.checkForDowloadDirectory(fileRemoteUrl)
    } else {
      this.filedownload(fileRemoteUrl)
    }
  }

  filedownload(fileRemoteUrl) {
    // const fileName = this.solutionName.replace(/\s/g, '') + "_" + this.datepipe.transform(new Date(), 'yyyy-MMM-dd-HH-mm-ss a') + ".pdf";
    const fileTransfer: FileTransferObject = this.fileTransfer.create();
    fileTransfer.download(fileRemoteUrl, this.appFolderPath + this.fileName).then(success => {
      this.action === 'share' ? this.dap.shareSubmissionDoc(this.appFolderPath + this.fileName) : this.dap.previewSubmissionDoc(this.appFolderPath + this.fileName)
    }).catch(error => {
    })
  }
  checkForDowloadDirectory(fileRemoteUrl) {
    this.file.checkDir(this.file.documentsDirectory, 'Download').then(success => {
      this.filedownload(fileRemoteUrl);
    }).catch(err => {
      this.file.createDir(cordova.file.documentsDirectory, 'Download', false).then(success => {
        this.filedownload(fileRemoteUrl);
      }, error => {
      })
    });
  }
}
