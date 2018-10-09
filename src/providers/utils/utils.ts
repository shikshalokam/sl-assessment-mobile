import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';
import { ApiProvider } from '../api/api';
import { AppConfigs } from '../appConfig';

@Injectable()
export class UtilsProvider {

  constructor(public http: HttpClient, public loadingCtrl: LoadingController, private apiService: ApiProvider,
    private toastCtrl: ToastController, private storage: Storage, private alertCtrl: AlertController) {
    console.log('Hello UtilsProvider Provider');
  }
  loading: any;

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
      duration: closeBtn ? 0 : 3000 ,
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

  setLocalImages(images) {
    this.storage.set('images', JSON.stringify(images));
  }

  sendFeedback() {
    let alert = this.alertCtrl.create({
      title: 'Feedback',
      inputs: [
        {
          name: 'name',
          placeholder: 'Name',
        },
        {
          name: 'feedback',
          placeholder: 'Feedback',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Send',
          role: 'role',
          handler: data => {
            if (data.name && data.feedback) {
              data.type = 'Suggestion';
              this.apiService.httpPost(AppConfigs.survey.feedback, data, success => {
                this.openToast(success.message);
              }, error => {
              })
            } else {
              this.openToast("Fill both fields")
            }
            // if (User.isValid(data.username, data.password)) {
            //   // logged in!
            // } else {
            //   // invalid login
            //   return false;
            // }
          }
        }
      ]
    });
    alert.present();
  }

  progressCalculate() {

  }

}
