import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';
// import { ApiProvider } from '../api/api';
// import { AppConfigs } from '../appConfig';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable()
export class UtilsProvider {

  constructor(public http: HttpClient, private locationAccuracy: LocationAccuracy, public loadingCtrl: LoadingController,
    private toastCtrl: ToastController, private storage: Storage) {
    console.log('Hello UtilsProvider Provider');
  }
  loading: any;
  imagePath: string;

  startLoader(msg: string = 'Please wait..') {
    this.loading = this.loadingCtrl.create({
      content: msg
    });
    this.loading.present();
  }

  stopLoader() {
    this.loading.dismiss();
  }

  openToast(msg, closeBtn?: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: closeBtn ? 0 : 3000,
      position: 'bottom',
      closeButtonText: closeBtn,
      showCloseButton: closeBtn ? true : false
    });

    toast.onDidDismiss(() => {
      // console.log('Dismissed toast');
    });

    toast.present();
  }

  setLocalSchoolData(data) {
    this.storage.set('schoolsDetails', JSON.stringify(data));
  }

  setCurrentimageFolderName(evidenceId, schoolId) {
    this.imagePath = 'images_' + evidenceId + '_' + schoolId;
    console.log("Image path: " + this.imagePath)
  }

  setLocalImages(images, isGeneralQuestion) {
    this.storage.set(isGeneralQuestion ?'genericQuestionsImages':'allImageList', JSON.stringify(images));
  }

  setLocalVariable(key, value) {
    this.storage.set(key, value);
  }

  testRegex(rege, value): boolean {
    const regex = new RegExp(rege);
    return regex.test(value)
  }

  isQuestionComplete(question): boolean {
    // console.log(JSON.stringify(question))
    if (question.validation.required && !question.value && question.responseType !== 'multiselect') {
      return false
    }
    if (question.validation.required && !question.value.length && question.responseType === 'multiselect') {
      return false
    }
    // if (question.file.required && (question.fileName.length < question.file.minCount)) {
    //   return false
    // }
    if (question.validation.regex && question.responseType === 'number' && !this.testRegex(question.validation.regex, question.value)) {
      return false
    }
    return true
  }

  isMatrixQuestionComplete(question): boolean {
    if (!question.value.length) {
      return false
    }
    // const noOfInstanceRequired = question.noOfInstances ? question.noOfInstances : 0;
    // if(question.ins)
    // if(noOfInstanceRequired && (question.value.length < noOfInstanceRequired)){
    //   return false
    // }
    for (const instance of question.value) {
      for (const question of instance) {
        if (!question.isCompleted) {
          return false
        }
      }
    }
    return true
  }

  enableGPSRequest() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
          () => {
            return true;
          },
          error => {
            console.log('Error requesting location permissions', error);
            this.enableGPSRequest()
          }
        );
      }

    });
  }

  createFormGroup(formFields): any {
    let formGrp = {};
    formFields.forEach(formfield => {
      formGrp[formfield.field] = formfield.validation.required ? new FormControl(formfield.value || "", Validators.required) : new FormControl(formfield.value || "");
    });
    return new FormGroup(formGrp)
  }

}

