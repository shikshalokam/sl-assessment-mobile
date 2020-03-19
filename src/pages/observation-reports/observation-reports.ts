import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { AppConfigs } from '../../providers/appConfig';
import { File } from '@ionic-native/file';
import { DownloadAndPreviewProvider } from '../../providers/download-and-preview/download-and-preview';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { UtilsProvider } from '../../providers/utils/utils';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { DatePipe } from '@angular/common';

declare var cordova: any;
@Component({
  selector: 'page-observation-reports',
  templateUrl: 'observation-reports.html',
})
export class ObservationReportsPage {

  reportObj;
  submissionId;
  observationId;
  solutionId;
  entityId;
  error;
  payload;
  appFolderPath;
  isIos;
  fileName;
  action;
  entityType;
  immediateChildEntityType;
  reportType: string;

  constructor(public navCtrl: NavController, private dap: DownloadAndPreviewProvider,
    public navParams: NavParams, private platform: Platform,
    private fileTransfer: FileTransfer, private utils: UtilsProvider,
    private androidPermissions: AndroidPermissions,
    private datepipe: DatePipe,
    private apiService: ApiProvider, private file: File) {
  }

  ionViewDidLoad() {
    this.submissionId = this.navParams.get('submissionId');
    this.observationId = this.navParams.get('observationId');
    this.solutionId = this.navParams.get('solutionId')
    this.entityId = this.navParams.get('entityId');
    this.entityType = this.navParams.get('entityType');
    this.immediateChildEntityType = this.navParams.get('immediateChildEntityType');
    this.reportType = this.navParams.get('reportType')
    this.payload = {
      "entityId": this.entityId,
      "submissionId": this.submissionId,
      "observationId": this.observationId
    }
    this.isIos = this.platform.is('ios') ? true : false;
    this.appFolderPath = this.isIos ? cordova.file.documentsDirectory + '/Download/' : cordova.file.externalRootDirectory + '/Download/';
    this.getObservationReports();
  }

  getObservationReports(download = false) {
    this.utils.startLoader();
    let url;
    if (this.entityType) {
      this.payload = {
        "entityId": this.entityId,
        "entityType": this.entityType,
        "solutionId": this.solutionId,
        "immediateChildEntityType": this.immediateChildEntityType,
        "reportType":this.reportType
      };
      url = AppConfigs.observationReports.entitySolutionReport;
    } else if (this.submissionId) {
      url = AppConfigs.observationReports.instanceReport;
    } else if (!this.submissionId && !this.entityId) {
      url = AppConfigs.observationReports.observationReport;
    } else {
      url = AppConfigs.observationReports.entityReport;
    }
    this.apiService.httpPost(url, this.payload, (success) => {
      if (success) {
        this.reportObj = success;
      } else {
        this.error = "No data found";
      }
      this.utils.stopLoader();
    }, error => {
      this.error = "No data found";
      this.utils.stopLoader();
    }, { baseUrl: "dhiti", version: this.entityType ? "v2" :"v1" })
  }

  downloadSharePdf(action) {
    this.action = action;
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(status => {
      if (status.hasPermission) {
        this.getObservationReportUrl();
      } else {
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(success => {
          if (success.hasPermission) {
            this.getObservationReportUrl();
          }
        }).catch(error => {
        })
      }
    })
  }

  // checkForSubmissionDoc(submissiond) {
  //   this.file.checkFile(this.appFolderPath, this.fileName).then(success => {
  //     this.action === 'share' ? this.dap.shareSubmissionDoc(this.appFolderPath + this.fileName) : this.dap.previewSubmissionDoc(this.appFolderPath + this.fileName)
  //   }).catch(error => {
  //     // this.getObservationReports(true)
  //     this.getObservationReportUrl();
  //   })
  // }

  getObservationReportUrl() {
    this.utils.startLoader();
    // + "type=submission&"
    let url = AppConfigs.observationReports.getReportsPdfUrls;
    const timeStamp = '_' + this.datepipe.transform(new Date(), 'yyyy-MMM-dd-HH-mm-ss a');
    if (this.entityType) {
      url = url + "entityId=" + this.entityId + "&solutionId=" + this.solutionId + '&reportType='+this.reportType +'&entityType=' + this.entityType + (this.immediateChildEntityType ? ('&immediateChildEntityType=' + this.immediateChildEntityType) : "");
      this.fileName = this.solutionId + '_' + this.entityId + '_' + this.immediateChildEntityType + '.pdf';
    } else if (this.submissionId) {
      url = url + "submissionId=" + this.submissionId;
      this.fileName = this.submissionId + timeStamp + ".pdf";
    } else if (!this.submissionId && !this.entityId) {
      url = url + "observationId=" + this.observationId;
      this.fileName = this.observationId + timeStamp + ".pdf";
    } else {
      url = url + "entityId=" + this.entityId + "&observationId=" + this.observationId;
      this.fileName = this.entityId + '_' + this.observationId + timeStamp + ".pdf";
    }

    this.apiService.httpGet(url, success => {
      this.utils.stopLoader();
      if (success.status === 'success' && success.pdfUrl) {
        this.downloadSubmissionDoc(success.pdfUrl);
      } else {
        this.utils.openToast(success.message);
      }
    }, error => {
      this.utils.openToast(error.message);

      this.utils.stopLoader();
    }, { baseUrl: "dhiti" })
  }


  downloadSubmissionDoc(fileRemoteUrl) {
    this.utils.startLoader();
    if (this.isIos) {
      this.checkForDowloadDirectory(fileRemoteUrl);
    } else {
      this.filedownload(fileRemoteUrl);
    }
  }
  filedownload(fileRemoteUrl) {
    // const fileName = this.solutionName.replace(/\s/g, '') + "_" + this.datepipe.transform(new Date(), 'yyyy-MMM-dd-HH-mm-ss a') + ".pdf";
    const fileTransfer: FileTransferObject = this.fileTransfer.create();
    fileTransfer.download(fileRemoteUrl, this.appFolderPath + this.fileName).then(success => {
      this.action === 'share' ? this.dap.shareSubmissionDoc(this.appFolderPath + this.fileName) : this.dap.previewSubmissionDoc(this.appFolderPath + this.fileName)
      this.utils.stopLoader();
    }).catch(error => {
      this.utils.stopLoader();
    })
  }


  checkForDowloadDirectory(fileRemoteUrl) {
    this.file.checkDir(this.file.documentsDirectory, 'Download').then(success => {
      this.filedownload(fileRemoteUrl);
    }).catch(err => {
      this.file.createDir(cordova.file.documentsDirectory, 'Download', false).then(success => {
        // this.fileName = 'record' + new Date().getDate() + new Date().getMonth() + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.mp3';
        // this.filesPath = this.file.documentsDirectory + "images/" + this.fileName;
        // this.audio = this.media.create(this.filesPath);
        // this.audio.startRecord();
        // this.startTimer();
        this.filedownload(fileRemoteUrl);

      }, error => {
      })
    });
  }

}
