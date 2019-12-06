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
  entityId;
  error;
  payload;
  appFolderPath;
  isIos;
  fileName;
  action;
  entityType;
  immediateChildEntityType;

  constructor(public navCtrl: NavController, private dap: DownloadAndPreviewProvider,
    public navParams: NavParams, private platform: Platform,
    private fileTransfer: FileTransfer, private utils: UtilsProvider,
    private androidPermissions: AndroidPermissions,
    private datepipe: DatePipe,
    private apiService: ApiProvider, private file: File) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ObservationReportsPage');
    this.submissionId = this.navParams.get('submissionId');
    this.observationId = this.navParams.get('observationId')
    this.entityId = this.navParams.get('entityId');
    this.entityType = this.navParams.get('entityType');
    this.immediateChildEntityType = this.navParams.get('immediateChildEntityType')
    this.payload = {
      "entityId": this.entityId,
      "submissionId": this.submissionId,
      "observationId": this.observationId,
    }
    this.isIos = this.platform.is('ios') ? true : false;
    this.appFolderPath = this.isIos ? cordova.file.documentsDirectory + '/Download/' : cordova.file.externalRootDirectory + '/Download/';

    // this.appFolderPath = this.isIos ? cordova.file.externalRootDirectory + '/Download/' : cordova.file.externalRootDirectory + '/Download/';
    this.getObservationReports();
  }




  getObservationReports(download = false) {
    this.utils.startLoader();
    let url;
    if (this.entityType) {
      this.payload = {
        "entityId": this.entityId,
        "entityType": this.entityType,
        "observationId": this.observationId,
        "immediateChildEntityType": this.immediateChildEntityType
      }
      url = AppConfigs.observationReports.entityObservationReport
    } else if (this.submissionId) {
      url = AppConfigs.observationReports.instanceReport;
    } else if (!this.submissionId && !this.entityId) {
      url = AppConfigs.observationReports.observationReport;
    } else {
      url = AppConfigs.observationReports.entityReport
    }


    // this.reportObj = {
    //   "entityName": "Sachdeva Convent School, Street No.-5 Sangam Vihar (Wazirabad - Jagatpur Road), Delhi",
    //   "observationName": "PISA-Classroom Observation Form",
    //   "observationId": "5da70be3c1b12e2431c26929",
    //   "entityType": "school",
    //   "entityId": "5bfe53ea1d0c350d61b78d0a",
    //   "response": [
    //     {
    //       "order": "CR001",
    //       "question": "Class:",
    //       "responseType": "number",
    //       "answers": [
    //         "12"
    //       ],
    //       "chart": {},
    //       "instanceQuestions": []
    //     },
    //     {
    //       "order": "CR002",
    //       "question": "Date:",
    //       "responseType": "date",
    //       "answers": [
    //         "16 Oct 2019, 7:39:12 PM"
    //       ],
    //       "chart": {},
    //       "instanceQuestions": []
    //     },
    //     {
    //       "order": "CR003",
    //       "question": "school assessment",
    //       "responseType": "matrix",
    //       "answers": [],
    //       "chart": {},
    //       "instanceQuestions": [
    //         {
    //           "order": "CR003A",
    //           "question": "Subject:",
    //           "responseType": "text",
    //           "answers": [
    //             "Maths"
    //           ],
    //           "chart": {},
    //           "instanceQuestions": []
    //         },
    //         {
    //           "order": "CR003B",
    //           "question": "What does teacher's rapport with learners look like?",
    //           "responseType": "multiselect",
    //           "answers": [
    //             [
    //               "Spoke respectfully to all students; did not humiliate or discriminate",
    //               "Not making students clear"
    //             ],
    //             [
    //               "Not making students clear"
    //             ],
    //             [
    //               "Spoke respectfully to all students; did not humiliate or discriminate",
    //               "Not making students clear"
    //             ],
    //             [
    //               "Spoke respectfully to all students; did not humiliate or discriminate",
    //             ],
    //           ],
    //           "chart": {
    //             "type": "bar",
    //             "data": [
    //               {
    //                 "data": [
    //                   100,
    //                   50
    //                 ]
    //               }
    //             ],
    //             "xAxis": {
    //               "categories": [
    //                 "Spoke respectfully to all students; did not humiliate or discriminate",
    //                 "Not making students clear"
    //               ],
    //               "title": {
    //                 "text": "Responses"
    //               }
    //             },
    //             "yAxis": {
    //               "title": {
    //                 "text": "Responses in percentage"
    //               }
    //             }
    //           },
    //           "instanceQuestions": []
    //         },
    //         {
    //           "order": "CR003C",
    //           "question": "What does teacher's rapport with learners look like?",
    //           "responseType": "multiselect",
    //           "answers": [
    //             [
    //               "Demonstrated sensitivity to learner's needs; specially engaged slow learners"
    //             ]
    //           ],
    //           "chart": {
    //             "type": "bar",
    //             "data": [
    //               {
    //                 "data": [
    //                   100
    //                 ]
    //               }
    //             ],
    //             "xAxis": {
    //               "categories": [
    //                 "Demonstrated sensitivity to learner's needs; specially engaged slow learners"
    //               ],
    //               "title": {
    //                 "text": "Responses"
    //               }
    //             },
    //             "yAxis": {
    //               "title": {
    //                 "text": "Responses in percentage"
    //               }
    //             }
    //           },
    //           "instanceQuestions": []
    //         },
    //         {
    //           "order": "CR003D",
    //           "question": "What does teacher's rapport with learners look like?",
    //           "responseType": "multiselect",
    //           "answers": [
    //             [
    //               "Created opportunities to appreciate and encourage learners."
    //             ]
    //           ],
    //           "chart": {
    //             "type": "bar",
    //             "data": [
    //               {
    //                 "data": [
    //                   100
    //                 ]
    //               }
    //             ],
    //             "xAxis": {
    //               "categories": [
    //                 "Created opportunities to appreciate and encourage learners."
    //               ],
    //               "title": {
    //                 "text": "Responses"
    //               }
    //             },
    //             "yAxis": {
    //               "title": {
    //                 "text": "Responses in percentage"
    //               }
    //             }
    //           },
    //           "instanceQuestions": []
    //         },
    //         {
    //           "order": "CR003E",
    //           "question": "Overall rating",
    //           "responseType": "radio",
    //           "answers": [
    //             "Expert",
    //             "Average",
    //             "Bad"
    //           ],
    //           "chart": {
    //             "type": "pie",
    //             "data": [
    //               {
    //                 "data": [
    //                   {
    //                     "name": "Expert",
    //                     "y": 30
    //                   },
    //                   {
    //                     "name": "Average",
    //                     "y": 50
    //                   },
    //                   {
    //                     "name": "Bad",
    //                     "y": 20
    //                   }
    //                 ]
    //               }
    //             ]
    //           },
    //           "instanceQuestions": []
    //         }
    //       ]
    //     },
    //     {
    //       "order": "CR006",
    //       "question": "How does the teacher respond to unexpected student behavior or disengagement during lesson?",
    //       "responseType": "multiselect",
    //       "answers": [
    //         "Resorts to corporal punishment"
    //       ],
    //       "chart": {},
    //       "instanceQuestions": []
    //     },
    //     {
    //       "order": "CR007",
    //       "question": "Overall rating",
    //       "responseType": "radio",
    //       "answers": [
    //         "Developing"
    //       ],
    //       "chart": {},
    //       "instanceQuestions": []
    //     },
    //     {
    //       "order": "CR008",
    //       "question": "How does teacher support learning process for students?",
    //       "responseType": "multiselect",
    //       "answers": [
    //         "Focused only on a small group of students while teaching; ignored the rest",
    //         "Took no initiative to encourage students; Maintained neutral tone towards students",
    //         "Engaged learners who are at different levels of learning through differentiated activities."
    //       ],
    //       "chart": {},
    //       "instanceQuestions": []
    //     },
    //     {
    //       "order": "CR009",
    //       "question": "Overall rating",
    //       "responseType": "radio",
    //       "answers": [
    //         "Expert"
    //       ],
    //       "chart": {},
    //       "instanceQuestions": []
    //     },
    //     {
    //       "order": "CR010",
    //       "question": "What does teaching - learning process in class look like?",
    //       "responseType": "multiselect",
    //       "answers": [
    //         "Used e-content to teach"
    //       ],
    //       "chart": {},
    //       "instanceQuestions": []
    //     },
    //     {
    //       "order": "CR011",
    //       "question": "Overall rating",
    //       "responseType": "radio",
    //       "answers": [
    //         "Developing"
    //       ],
    //       "chart": {},
    //       "instanceQuestions": []
    //     },
    //     {
    //       "order": "CR012",
    //       "question": "How was teacher's command over content?",
    //       "responseType": "multiselect",
    //       "answers": [
    //         "Was able to draw upon additional information beyond the text",
    //         "Made connections to other subjects and topics"
    //       ],
    //       "chart": {},
    //       "instanceQuestions": []
    //     },
    //     {
    //       "order": "CR013",
    //       "question": "Overall rating",
    //       "responseType": "radio",
    //       "answers": [
    //         "Proficient"
    //       ],
    //       "chart": {},
    //       "instanceQuestions": []
    //     },
    //     {
    //       "order": "CR014",
    //       "question": "What is the rigor of activities in which students are engaged?",
    //       "responseType": "multiselect",
    //       "answers": [
    //         "Were visibly disengaged and uninterested",
    //         "Participated in independent problem solving or project work or challenging tasks"
    //       ],
    //       "chart": {},
    //       "instanceQuestions": []
    //     },
    //     {
    //       "order": "CR015",
    //       "question": "Overall rating",
    //       "responseType": "radio",
    //       "answers": [
    //         "Proficient"
    //       ],
    //       "chart": {},
    //       "instanceQuestions": []
    //     }
    //   ]
    // }

    this.apiService.httpPost(url, this.payload, (success) => {
      if (success) {
        this.reportObj = success;
        console.log('reportObj', this.reportObj);
      } else {
        this.error = "No data found"
      }
      this.utils.stopLoader();

    }, error => {
      this.error = "No data found";
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
      url = url +  "entityId=" + this.entityId + "&observationId=" + this.observationId + '&entityType='+ this.entityType+ (this.immediateChildEntityType ? ('&immediateChildEntityType='+ this.immediateChildEntityType) : "");
      this.fileName = this.observationId+'_'+this.entityId+'_'+this.immediateChildEntityType+'.pdf';
    } else if (this.submissionId) {
      url = url + "submissionId=" + this.submissionId;
      this.fileName = this.submissionId + timeStamp + ".pdf";
    } else if (!this.submissionId && !this.entityId) {
      url = url + "observationId=" + this.observationId
      this.fileName = this.observationId + timeStamp + ".pdf";
    } else {
      url = url + "entityId=" + this.entityId + "&observationId=" + this.observationId
      this.fileName = this.entityId + '_' + this.observationId + timeStamp + ".pdf";
    }

    this.apiService.httpGet(url, success => {
      this.utils.stopLoader();
      if (success.status === 'success' && success.pdfUrl) {
        this.downloadSubmissionDoc(success.pdfUrl);
      } else {
        this.utils.openToast(success.message)
      }
    }, error => {
      this.utils.openToast(error.message)

      this.utils.stopLoader();
    }, { baseUrl: "dhiti" })
  }


  downloadSubmissionDoc(fileRemoteUrl) {
    // this.utils.startLoader();
    // const fileName = "submissionDoc_" + this.fileName;
    // const fileTransfer: FileTransferObject = this.fileTransfer.create();

    // fileTransfer.download(fileRemoteUrl, this.appFolderPath + fileName).then(success => {
    //   this.action === 'share' ? this.dap.shareSubmissionDoc(this.appFolderPath + fileName) : this.dap.previewSubmissionDoc(this.appFolderPath + fileName)
    //   this.utils.stopLoader();
    // }).catch(error => {
    //   this.utils.stopLoader();
    // })
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
