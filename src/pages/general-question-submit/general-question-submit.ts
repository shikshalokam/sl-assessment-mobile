import { Component } from '@angular/core';
import { NavController, NavParams, App, Platform } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { UtilsProvider } from '../../providers/utils/utils';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { AppConfigs } from '../../providers/appConfig';
import { Storage } from '@ionic/storage';

declare var cordova: any;

@Component({
  selector: 'page-general-question-submit',
  templateUrl: 'general-question-submit.html',
})
export class GeneralQuestionSubmitPage {

  uploadImages: any;
  imageList = [];
  appFolderPath: string = this.platform.is('ios') ? cordova.file.documentsDirectory + 'images' : cordova.file.externalDataDirectory + 'images';
  schoolId: any;
  schoolName: string
  selectedEvidenceIndex: any;
  // currentEvidenceId: any;
  uploadIndex: number = 0;
  schoolData: any;
  // currentEvidence: any;
  evidenceSections: any;
  selectedEvidenceName: any;
  imageLocalCopyId: any;
  submissionId: any;
  generalQuestions: any;
  allGeneralQuestions: any;
  copyOfOriginalGeneralQuestions: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storage: Storage, private file: File, private fileTransfer: FileTransfer,
    private apiService: ApiProvider, private utils: UtilsProvider,
    private app: App, private platform: Platform) {
    this.schoolId = this.navParams.get('_id');

  }

  ionViewDidLoad() {
    console.log("in")
    console.log()
    console.log(this.schoolId)
    // this.schoolName = this.navParams.get('name');

    this.storage.get('schoolsDetails').then(data => {
      if(data) {
        this.schoolData = JSON.parse(data);
        this.submissionId = this.schoolData[this.schoolId]['assessments'][0]['submissionId'];
      }
    }).catch(error => {

    })

    this.storage.get('generalQuestions').then(data => {
      this.allGeneralQuestions = JSON.parse(data)
      this.generalQuestions = this.allGeneralQuestions[this.schoolId];
      // console.log(JSON.stringify(this.generalQuestions))
    }).catch(error => {

    })
    this.storage.get('generalQuestionsCopy').then(data => {
      this.copyOfOriginalGeneralQuestions = JSON.parse(data)[this.schoolId];
      // console.log(JSON.stringify(this.generalQuestions))
    }).catch(error => {

    })
    this.storage.get("genericQuestionsImages").then(data => {
      if (data && JSON.parse(data)[this.schoolId]) {
        this.uploadImages = (JSON.parse(data)[this.schoolId]) ? (JSON.parse(data)[this.schoolId]) : [];
      } else {
        this.uploadImages = [];
      }
      console.log(this.uploadImages.length)
      if (this.uploadImages.length) {
        this.createImageFromName(this.uploadImages);
      } else {
        this.submitEvidence();
      }
    })

  }

  createImageFromName(imageList) {
    this.utils.startLoader();
    // for (const image of imageList) {
    //   this.file.checkFile(this.appFolderPath + '/', image.name).then(response => {
    //     this.file.readAsDataURL(this.appFolderPath, image.name).then(data => {
    //       this.imageList.push({ data: data, uploaded: false, file: image.name, url: "" });
    //     }).catch(err => {
    //     })
    //   }).catch(error => {
    //   })
    // }

    for (const image of imageList) {
      this.imageList.push({ uploaded: false, file: image.name, url: "" });
    }
    this.getImageUploadUrls();
  }

  getImageUploadUrls() {
    // const submissionId = this.schoolData[this.schoolId]['assessments'][0]['submissionId'];
    const files = {
      "files": [],
      submissionId: this.submissionId
    }
    for (const image of this.uploadImages) {
      files.files.push(image.name)
    }
    this.apiService.httpPost(AppConfigs.survey.getImageUploadUr, files, success => {
      this.utils.stopLoader();
      for (let i = 0; i < success.result.length; i++) {
        this.imageList[i]['url'] = success.result[i].url;
        this.imageList[i]['sourcePath'] = success.result[i].payload.sourcePath;
      }
      this.cloudImageUpload();
      this.fileTransfer.create()
    }, error => {
      this.utils.stopLoader();
      this.utils.openToast('Unable to get google urls')
    })
  }

  cloudImageUpload() {
    var options: FileUploadOptions = {
      fileKey: this.imageList[this.uploadIndex].file,
      fileName: this.imageList[this.uploadIndex].file,
      chunkedMode: false,
      mimeType: "image/jpeg",
      headers: {
        "Content-Type": 'multipart/form-data'
      },
      httpMethod: 'PUT',
    };
    let targetPath = this.pathForImage(this.imageList[this.uploadIndex].file);
    let fileTrns: FileTransferObject = this.fileTransfer.create();
    fileTrns.upload(targetPath, this.imageList[this.uploadIndex].url, options).then(result => {
      this.imageList[this.uploadIndex].uploaded = true;
      if (this.uploadIndex < (this.imageList.length - 1)) {
        this.uploadIndex++;
        this.cloudImageUpload();
      } else {
        // this.utils.stopLoader();
        this.submitEvidence();
      }
    }).catch(err => {
    })
  }

  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      const path = this.platform.is('ios') ? cordova.file.documentsDirectory : cordova.file.externalDataDirectory
      return path + 'images/' + img;
    }
  }

  submitEvidence() {
    this.utils.startLoader('Please wait while submitting')
    const payload = this.constructPayload();
    // const submissionId = this.schoolData[this.schoolId]['assessments'][0].submissionId;
    const url = AppConfigs.survey.submitGeneralQuestions + this.submissionId;
    console.log(url)
    console.log(JSON.stringify(payload))
    this.apiService.httpPost(url, payload, response => {
      this.utils.openToast(response.message);
      console.log(JSON.stringify(response))
      // if(response.status ===);
      this.allGeneralQuestions[this.schoolId] = JSON.parse(JSON.stringify(this.copyOfOriginalGeneralQuestions))
      // this.generalQuestions = this.copyOfOriginalGeneralQuestions;
      this.storage.set('generalQuestions', JSON.stringify(this.allGeneralQuestions));
      this.storage.remove('genericQuestionsImages');
      this.utils.stopLoader();
      this.navCtrl.pop();
    }, error => {
      this.utils.stopLoader();
    })

  }

  constructPayload(): any {
    const payload = {
      'answers': {}
    }
    console.log("innnnnn")
    for (const question of this.generalQuestions) {
      if(question.isCompleted) {
        payload.answers[question._id] = {
          "qid": question._id,
          "value":question.responseType === 'matrix' ? this.constructMatrixObject(question) : question.value,
          "remarks": question.remarks,
          "fileName":[
          ],
          "payload":{
            question: question.question,
            labels: [],
            responseType: question.responseType
          },
          "startTime":question.startTime,
          "endTime":question.endTime,
          "countOfInstances": question.responseType === 'matrix' ? question.value.length : 1,
        };
        console.log(JSON.stringify(question.payload));
        for (const key of Object.keys(question.payload)) {
          console.log(key)
          console.log(question.payload[key])
          payload.answers[question._id][key] = question.payload[key];
          console.log("done")
        }
  
        if (question.fileName && question.fileName.length) {
          const filePaylaod = []
          for (const fileName of question.fileName) {
            for (const updatedFileDetails of this.imageList) {
              if (fileName === updatedFileDetails.file) {
                const obj = {
                  name: fileName,
                  sourcePath: updatedFileDetails.sourcePath
                }
                filePaylaod.push(obj);
              }
            }
          }
          payload.answers[question._id].fileName = filePaylaod;
        }
  
        if (question.responseType === 'multiselect') {
          for (const val of question.value) {
            for (const option of question.options) {
              if (val === option.value && payload.answers[question._id].payload.labels.indexOf(option.label) <= 0) {
                payload.answers[question._id].payload.labels.push(option.label);
              }
            }
          }
  
        } else if (question.responseType === 'radio') {
  
          for (const option of question.options) {
            if (payload.answers[question._id].value === option.value && payload.answers[question._id].payload.labels.indexOf(option.label) <= 0) {
              payload.answers[question._id].payload.labels.push(option.label);
            }
          }
  
        } else {
          payload.answers[question._id].payload.labels.push(question.value);
        }
      }
 
    }

    // console.log(JSON.stringify(payload))
  //   const evidence = {
  //     id: "",
  //     externalId: "",
  //     answers: {},
  //     startTime: 0,
  //     endTime: 0
  //   };
  //   const currentEvidence = this.schoolData[this.schoolId]['assessments'][0]['evidences'][this.selectedEvidenceIndex]
  //   evidence.id = currentEvidence._id;
  //   evidence.externalId = currentEvidence.externalId;
  //   evidence.startTime = currentEvidence.startTime;
  //   evidence.endTime = Date.now();
  //   for (const section of this.evidenceSections) {
  //     for (const question of section.questions) {
  //       let obj = {
  //         qid: question._id,
  //         value: question.responseType === 'matrix' ? this.constructMatrixObject(question) : question.value,
  //         remarks: question.remarks,
  //         fileName: [],
  //         payload: {
            // question: question.question,
            // labels: [],
            // responseType: question.responseType
  //         },
  //         startTime: question.startTime,
  //         endTime: question.endTime
  //       };

        // if (question.fileName && question.fileName.length) {
        //   const filePaylaod = []
        //   for (const fileName of question.fileName) {
        //     for (const updatedFileDetails of this.imageList) {
        //       if (fileName === updatedFileDetails.file) {
        //         const obj = {
        //           name: fileName,
        //           sourcePath: updatedFileDetails.sourcePath
        //         }
        //         filePaylaod.push(obj);
        //       }
        //     }
        //   }
        //   obj.fileName = filePaylaod;
        // }

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
  //       for (const key of Object.keys(question.payload)) {
  //         obj[key] = question.payload[key];
  //       }
  //       evidence.answers[obj.qid] = obj;
  //     }
  //   }
  //   payload.evidence = evidence;
    return payload
  }

  constructMatrixObject(question) {
    console.log("contr")
    const value = [];
    // const currentEvidence = this.schoolData[this.schoolId]['assessments'][0]['evidences'][this.selectedEvidenceIndex]

    for (const instance of question.value) {
      let eachInstance = {};
      for (let qst of instance) {

        const obj1 = {
          qid: qst._id,
          value: qst.value,
          remarks: qst.remarks,
          fileName: [],
          payload: {
            question: qst.question,
            labels: [],
            responseType: qst.responseType
          },
          startTime: qst.startTime,
          endTime: qst.endTime
        }
        if (qst.fileName && qst.fileName.length) {
          const filePaylaod = []
          for (const fileName of qst.fileName) {
            for (const updatedFileDetails of this.imageList) {
              if (fileName === updatedFileDetails.file) {
                const fileobj = {
                  name: fileName,
                  sourcePath: updatedFileDetails.sourcePath
                }
                filePaylaod.push(fileobj);
              }
            }
          }
          obj1.fileName = filePaylaod;
        }
        if (qst.responseType === 'multiselect') {
          for (const val of qst.value) {
            for (const option of qst.options) {
              if (val === option.value && obj1.payload.labels.indexOf(option.label) <= 0) {
                obj1.payload.labels.push(option.label);
              }
            }
          }

        } else if (qst.responseType === 'radio') {
          for (const option of qst.options) {
            if (obj1.value === option.value && obj1.payload.labels.indexOf(option.label) <= 0) {
              obj1.payload.labels.push(option.label);
            }
          }
        } else {
          obj1.payload.labels.push(qst.value);
        }

        for (const key of Object.keys(qst.payload)) {
          obj1[key] = qst.payload[key];
        }
        eachInstance[obj1.qid] = obj1;
      }
      value.push(eachInstance)
    }
    console.log('return')
    return value
  }

}
