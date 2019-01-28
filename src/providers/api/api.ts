import { Http, URLSearchParams, Headers } from '@angular/http';

import { Injectable } from '@angular/core';
import { CurrentUserProvider } from '../current-user/current-user';
import { AppConfigs } from '../appConfig';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { App, AlertController } from 'ionic-angular'
import { WelcomePage } from '../../pages/welcome/welcome';
import { UtilsProvider } from '../utils/utils';
import { AuthProvider } from '../auth/auth';
import { NetworkGpsProvider } from '../network-gps/network-gps';
import { SlackProvider } from '../slack/slack';
import { HTTP } from '@ionic-native/http';

@Injectable()
export class ApiProvider {

  constructor(public http: HTTP,
    public currentUser: CurrentUserProvider,
    private appCtrls: App, private utils: UtilsProvider,
    private auth: AuthProvider,
    private alertCntrl: AlertController,
    private ngps: NetworkGpsProvider, private slack: SlackProvider) {
  }

  errorObj = {
    "fallback": "User Details",
    "title": `Error Details`,
    "text": ``
  }

  isNetworkAvailabel(): boolean {
    return this.ngps.getNetworkStatus()
  }


  validateApiToken(): Promise<any> {
    this.http.setDataSerializer('json');
    this.http.setRequestTimeout(300);
    return new Promise((resolve, reject) => {
      const userDetails = this.currentUser.getCurrentUserData();
      if (userDetails.exp <= (Date.now() / 1000)) {
        const body = new URLSearchParams();
        body.set('grant_type', "refresh_token");
        body.set('client_id', AppConfigs.clientId);
        body.set('refresh_token', this.currentUser.curretUser.refreshToken);
        const url = AppConfigs.app_url + AppConfigs.keyCloak.getAccessToken;
        const header = {
          'grant_type': "refresh_token",
          'client_id': AppConfigs.clientId,
          'refresh_token': this.currentUser.curretUser.refreshToken
        }
        this.http.post(url, body, header).then(data => {
          let parsedData = JSON.parse(data['_body']);
          let userTokens = {
            accessToken: parsedData.access_token,
            refreshToken: parsedData.refresh_token,
            idToken: parsedData.id_token
          };
          this.currentUser.setCurrentUserDetails(userTokens);
          resolve()
        }).catch(error => {
          reject({ status: '401' });
        })
      } else {
        resolve();
      }
    })
  }


  httpPost(url, payload, successCallback, errorCallback) {
    let nav = this.appCtrls.getActiveNav();
    this.validateApiToken().then(response => {
      const gpsLocation = this.ngps.getGpsLocation()
      const obj = {
        'x-authenticated-user-token': this.currentUser.curretUser.accessToken,
        'gpsLocation': gpsLocation ? gpsLocation : '0,0',
        'appVersion': AppConfigs.appVersion
      }
      const apiUrl = AppConfigs.api_base_url + url;
      this.http.setDataSerializer('json');
      this.http.post(apiUrl, payload, obj).then(data => {
        successCallback(JSON.parse(data.data));
      }).catch(error => {
        const errorObject = { ...this.errorObj };
        errorObject.text = `API failed. URL: ${apiUrl}. Error  Details ${JSON.stringify(error)}. Payload: ${JSON.stringify(payload)}.`;
        this.slack.pushException(errorObject);
        this.utils.openToast("Something went wrong. Please try again", 'Ok');
        const errorDetails = JSON.parse(error['_body']);
        if (errorDetails.status === "ERR_TOKEN_INVALID") {
          this.auth.doLogout().then(success => {
            this.reLoginAlert();
          }).catch(error => {
          })
        } else {
          this.utils.openToast(error.message, 'Ok');
        }
        errorCallback(error);
      })
    }).catch(error => {
      this.auth.doLogout().then(success => {
        this.reLoginAlert();
      }).catch(error => {
      })
      errorCallback(error);
    })
  }


  httpGet(url, successCallback, errorCallback) {
    let nav = this.appCtrls.getActiveNav();
    this.validateApiToken().then(response => {
      const gpsLocation = this.ngps.getGpsLocation()
      const obj = {
        'x-authenticated-user-token': this.currentUser.curretUser.accessToken,
        'gpsLocation': gpsLocation ? gpsLocation : '0,0',
        'appVersion': AppConfigs.appVersion
      }
      this.http.setDataSerializer('json');
      const apiUrl = AppConfigs.api_base_url + url;
      this.http.get(apiUrl, {}, obj).then(data => {
        successCallback(JSON.parse(data.data));
      }).catch(error => {
        const errorObject = { ...this.errorObj };
        errorObject.text = `API failed. URL: ${apiUrl}. Details ${JSON.stringify(error)}`;
        this.slack.pushException(errorObject);
        const errorDetails = JSON.parse(error['_body']);
        if (errorDetails.status === "ERR_TOKEN_INVALID") {
          this.auth.doLogout().then(success => {
            this.reLoginAlert();
          }).catch(error => {
          })
        } else {
          this.utils.openToast(error.message, 'Ok');
        }
        this.utils.openToast(error.message, 'Ok');

        errorCallback(error);
      })
    }).catch(error => {
      this.utils.openToast("Something went wrong. Please try again", 'Ok');
      this.auth.doLogout().then(success => {
        this.reLoginAlert();
      }).catch(error => {
      })
      errorCallback(error);
    })
  }

  reLoginAlert() {
    let alert = this.alertCntrl.create({
      title: 'Session has expired. Please login again to continue',
      buttons: [
        {
          text: 'Login',
          role: 'role',
          handler: data => {
            this.currentUser.deactivateActivateSession(true);
            let nav = this.appCtrls.getRootNav();
            nav.setRoot(WelcomePage);
          }
        }
      ],
      enableBackdropDismiss: false
    });
    alert.present();
  }

} 
