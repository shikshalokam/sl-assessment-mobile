import { Component } from '@angular/core';
import { NavController, NavParams, App, Platform } from 'ionic-angular';
import { UtilsProvider } from '../../providers/utils/utils';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { ApiProvider } from '../../providers/api/api';
import { AppConfigs } from '../../providers/appConfig';

declare var cordova: any;

@Component({
  selector: 'page-image-listing',
  templateUrl: 'image-listing.html',
})
export class ImageListingPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storage: Storage, private file: File, private fileTransfer: FileTransfer,
    private apiService: ApiProvider, private utils: UtilsProvider,
    private app: App, private platform: Platform) {
  }

  uploadImages: any;
  imageList = [];
  appFolderPath: string = this.platform.is('ios') ? cordova.file.documentsDirectory + 'images' : cordova.file.externalDataDirectory + 'images';
  schoolId: any;
  schoolName: string
  selectedEvidenceIndex: any;
  currentEvidenceId: any;
  uploadIndex: number = 0;
  schoolData: any;
  currentEvidence: any;
  evidenceSections: any;
  selectedEvidenceName: any;
  imageLocalCopyId: any;

  ionViewDidLoad() {
    this.schoolId = this.navParams.get('_id');
    this.schoolName = this.navParams.get('name');
    this.selectedEvidenceIndex = this.navParams.get('selectedEvidence');
    this.currentEvidenceId = this.navParams.get('selectedEvidenceId');

    this.storage.get('schoolsDetails').then(data => {
      this.schoolData = JSON.parse(data);
      this.currentEvidence = this.schoolData[this.schoolId]['assessments'][0]['evidences'][this.selectedEvidenceIndex];
      this.imageLocalCopyId = "images_" + this.currentEvidence.externalId + "_" + this.schoolId;
      this.evidenceSections = this.schoolData[this.schoolId]['assessments'][0]['evidences'][this.selectedEvidenceIndex]['sections'];
      this.selectedEvidenceName = this.schoolData[this.schoolId]['assessments'][0]['evidences'][this.selectedEvidenceIndex]['name'];
    }).catch(error => {

    })
    this.storage.get("allImageList").then(data => {
      if (data && JSON.parse(data)[this.schoolId]) {
        this.uploadImages = (JSON.parse(data)[this.schoolId][this.currentEvidence.externalId]) ? (JSON.parse(data)[this.schoolId][this.currentEvidence.externalId]) : [];
      } else {
        this.uploadImages = [];
      }
      if (this.uploadImages.length) {
        this.createImageFromName(this.uploadImages);
      } else {
        this.submitEvidence();
      }
    })

  }

  getImageUploadUrls() {
    const submissionId = this.schoolData[this.schoolId]['assessments'][0]['submissionId'];
    const files = {
      "files": [],
      submissionId: submissionId
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
    const submissionId = this.schoolData[this.schoolId]['assessments'][0].submissionId;
    const url = AppConfigs.survey.submission + submissionId;
    // console.log(JSON.stringify(payload))
    this.apiService.httpPost(url, payload, response => {
      this.utils.openToast(response.message);
      this.schoolData[this.schoolId]['assessments'][0]['evidences'][this.selectedEvidenceIndex].isSubmitted = true;
      this.utils.setLocalSchoolData(this.schoolData);
      const options = {
        _id: this.schoolId,
        name: this.schoolName
      }
      this.utils.stopLoader();
      this.navCtrl.remove(2, 1);
      this.navCtrl.pop();
    }, error => {
      this.utils.stopLoader();
    })

  }

  constructPayload(): any {
    const payload = {
      'evidence': {}
    }
    const evidence = {
      id: "",
      externalId: "",
      answers: {},
      startTime: 0,
      endTime: 0
    };
    const currentEvidence = this.schoolData[this.schoolId]['assessments'][0]['evidences'][this.selectedEvidenceIndex]
    evidence.id = currentEvidence._id;
    evidence.externalId = currentEvidence.externalId;
    evidence.startTime = currentEvidence.startTime;
    evidence.endTime = Date.now();
    for (const section of this.evidenceSections) {
      for (const question of section.questions) {
        let obj = {
          qid: question._id,
          value: question.responseType === 'matrix' ? this.constructMatrixObject(question) : question.value,
          remarks: question.remarks,
          fileName: [],
          payload: {
            question: question.question,
            labels: [],
            responseType: question.responseType
          },
          startTime: question.startTime,
          endTime: question.endTime
        };

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
          obj.fileName = filePaylaod;
        }

        if (question.responseType === 'multiselect') {
          for (const val of question.value) {
            for (const option of question.options) {
              if (val === option.value && obj.payload.labels.indexOf(option.label) <= 0) {
                obj.payload.labels.push(option.label);
              }
            }
          }

        } else if (question.responseType === 'radio') {

          for (const option of question.options) {
            if (obj.value === option.value && obj.payload.labels.indexOf(option.label) <= 0) {
              obj.payload.labels.push(option.label);
            }
          }

        } else {
          obj.payload.labels.push(question.value);
        }
        for (const key of Object.keys(question.payload)) {
          obj[key] = question.payload[key];
        }
        evidence.answers[obj.qid] = obj;
      }
    }
    payload.evidence = evidence;
    return payload
  }

  constructMatrixObject(question) {
    const value = [];
    const currentEvidence = this.schoolData[this.schoolId]['assessments'][0]['evidences'][this.selectedEvidenceIndex]

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

    return value
  }

}
