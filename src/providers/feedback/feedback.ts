import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { ApiProvider } from '../api/api';
import { UtilsProvider } from '../utils/utils';
import { AppConfigs } from '../appConfig';

/*
  Generated class for the FeedbackProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FeedbackProvider {

  constructor(public http: HttpClient, private alertCtrl : AlertController,
    private apiService: ApiProvider, private utils: UtilsProvider) {
    console.log('Hello FeedbackProvider Provider');
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
                this.utils.openToast(success.message);
              }, error => {
              })
            } else {
              this.utils.openToast("Please fill both fields")
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

}
