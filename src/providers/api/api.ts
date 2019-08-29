
import { Http, URLSearchParams, Headers } from '@angular/http';

import { Injectable } from '@angular/core';
import { App, AlertController } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';

import { CurrentUserProvider } from '../current-user/current-user';
import { AppConfigs } from '../appConfig';
import { WelcomePage } from '../../pages/welcome/welcome';
import { UtilsProvider } from '../utils/utils';
// import { AuthProvider } from '../auth/auth';
import { NetworkGpsProvider } from '../network-gps/network-gps';
import { SlackProvider } from '../slack/slack';

@Injectable()
export class ApiProvider {

  constructor(public http: HTTP,
    public currentUser: CurrentUserProvider,
    private appCtrls: App, 
    private utils: UtilsProvider,
    private alertCntrl: AlertController,
    private ngps: NetworkGpsProvider, 
    private slack: SlackProvider,
    private ngHttp: Http
    ) {
  }

  errorObj = {
    "fallback": "User Details",
    "title": `Error Details`,
    "text": ``
  }

  errorTokenRetryCount: number = 0;

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

  refershToken(): Promise<any> {
    this.http.setDataSerializer('json');
    const body = new URLSearchParams();
    body.set('grant_type', "refresh_token");
    // body.set('refresh_token', this.currentUser.curretUser.refreshToken);
    body.set('client_id', AppConfigs.clientId);
    body.set('client_secret', AppConfigs.api_key);
    return new Promise((resolve, reject) => {
      const obj = 'grant_type=refresh_token&refresh_token=' + this.currentUser.curretUser.refreshToken + "&client_id=" + AppConfigs.clientId;
      const url = AppConfigs.app_url + AppConfigs.keyCloak.getAccessToken;
      const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' })
      this.ngHttp.post(url, obj, { headers: headers }).subscribe(data => {
        let parsedData = JSON.parse(data['_body']);
        if (parsedData && parsedData.access_token) {
          let userTokens = {
            accessToken: parsedData.access_token,
            refreshToken: this.currentUser.curretUser.refreshToken,
          };
          this.currentUser.setCurrentUserDetails(userTokens);
          resolve()
        } else {
          reject();
        }
        // if(parsedData.error === 'invalid_grant'){
        //   reject();
        // } else {
        //   let userTokens = {
        //     accessToken: parsedData.access_token,
        //     refreshToken: this.currentUser.curretUser.refreshToken,
        //   };
        //   this.currentUser.setCurrentUserDetails(userTokens);
        //   resolve()
        // }
      }, error => {
        reject();
      })
    })
  }

  OnTokenExpired(url, payload, successCallback, errorCallback, requestType) {
    const apiUrl = AppConfigs.api_base_url + url;
    if (this.errorTokenRetryCount >= 3) {
      errorCallback({});
      const errorObject = { ...this.errorObj };
      errorObject.text = `API failed. URL: ${apiUrl}. Error  Details ${JSON.stringify(errorObject)}.Toke expired. Relogin enabled.`;
      this.slack.pushException(errorObject);
      this.utils.openToast("Something went wrong. Please try again", 'Ok');
      this.doLogout().then(success => {
        this.reLoginAlert();
      }).catch(error => {
      })
    } else {
      this.refershToken().then(success => {
        if (requestType === 'post') {
          this.httpPost(url, payload, successCallback, errorCallback)
        } else {
          this.httpGet(url, successCallback, errorCallback)
        }
      }).catch(error => {
        const errorObject = { ...this.errorObj };
        errorObject.text = `API failed. URL: ${apiUrl}. Error  Details ${JSON.stringify(error)}. Payload: ${JSON.stringify(payload)}.`;
        this.slack.pushException(errorObject);
        this.utils.openToast("Something went wrong. Please try again", 'Ok');
        errorCallback(error);
        this.doLogout().then(success => {
          this.reLoginAlert();
        }).catch(error => {
        })
      })
    }
  }


  httpPost(url, payload, successCallback, errorCallback , config?) {
    // let nav = this.appCtrls.getActiveNav();
    let options = {};
    console.log("httpget" + JSON.stringify(options))
    options['version'] = (config && config.version )? config.config :"v1";
    options['dhiti'] = (config && config.dhiti ) ? config.dhiti :false;
    this.validateApiToken().then(response => {
      const gpsLocation = this.ngps.getGpsLocation()
      const obj = {
        'x-authenticated-user-token': this.currentUser.curretUser.accessToken,
        'gpsLocation': gpsLocation ? gpsLocation : '0,0',
        'appVersion': AppConfigs.appVersion
      }
      // const apiUrl = AppConfigs.api_base_url + url;
      const apiUrl = options['dhiti'] ? AppConfigs.dhiti_base_url+options['version']+ url : AppConfigs.api_base_url + options['version']+ url;

      console.log(apiUrl)

      this.http.setDataSerializer('json');
      this.http.post(apiUrl, payload, obj).then(data => {

        successCallback(JSON.parse(data.data));
      }).catch(error => {
        const errorDetails = JSON.parse(error['error']);
        if (errorDetails.status === "ERR_TOKEN_INVALID") {
          this.errorTokenRetryCount++;
          this.OnTokenExpired(url, payload, successCallback, errorCallback, "post");
        } else {
          this.utils.openToast(error.message, 'Ok');
          const errorObject = { ...this.errorObj };
          errorObject.text = `API failed. URL: ${apiUrl}. Error  Details ${JSON.stringify(error)}. Payload: ${JSON.stringify(payload)}.`;
          this.slack.pushException(errorObject);
        }
      })
    }).catch(error => {
      this.OnTokenExpired(url, payload, successCallback, errorCallback, "post");
    })
  }


  httpGet(url, successCallback, errorCallback , config?) {
    // console.log("httpget" + JSON.stringify(options))
    // if(options && options.version){
      let options = {};
      options['version'] = (config && config.version )? config.version :"v1";
      options['dhiti'] = (config && config.dhiti ) ? config.dhiti :false;
    // }

    this.validateApiToken().then(response => {
      const gpsLocation = this.ngps.getGpsLocation();
      const obj = {
        'x-authenticated-user-token': this.currentUser.curretUser.accessToken,
        'gpsLocation': gpsLocation ? gpsLocation : '0,0',
        'appVersion': AppConfigs.appVersion
      }
      this.http.setDataSerializer('json');
      const apiUrl = options['dhiti'] ? AppConfigs.dhiti_base_url+options['version']+ url : AppConfigs.api_base_url + options['version']+ url;
      console.log(apiUrl)
      this.http.get(apiUrl, {}, obj).then(data => {
        successCallback(JSON.parse(data.data));
        console.log("success data")
      }).catch(error => {

        console.log(JSON.stringify(error));
        const errorDetails = error['error'] ? JSON.parse(error['error']) : error ;
        if (errorDetails.status === "ERR_TOKEN_INVALID") {
          this.errorTokenRetryCount++;
          this.OnTokenExpired(url, " ", successCallback, errorCallback, "get");
        } else {
          this.utils.openToast(error.message, 'Ok');
          const errorObject = { ...this.errorObj };
          errorObject.text = `API failed. URL: ${apiUrl}. Error  Details ${JSON.stringify(error)}`;
          this.slack.pushException(errorObject);
        }
      })
    }).catch(error => {
      this.OnTokenExpired(url, " ", successCallback, errorCallback, "get");
    })
  }



  reLoginAlert() {
    this.currentUser.deactivateActivateSession(true);
    let nav = this.appCtrls.getRootNav();
    nav.setRoot(WelcomePage);
    let alert = this.alertCntrl.create({
      title: 'Session has expired. Please login again to continue',
      buttons: [
        {
          text: 'Login',
          role: 'role',
          handler: data => {}
        }
      ],
      enableBackdropDismiss: false
    });
    alert.present();
  }

  doLogout(): Promise<any> {
    return new Promise(function (resolve) {
      let logout_redirect_url = AppConfigs.keyCloak.logout_redirect_url;
      let logout_url = AppConfigs.app_url + "/auth/realms/sunbird/protocol/openid-connect/logout?redirect_uri=" + logout_redirect_url;
      console.log(logout_url);

      let closeCallback = function (event) {
      };

      let browserRef = (<any>window).cordova.InAppBrowser.open(logout_url, "_blank", "zoom=no");
      browserRef.addEventListener('loadstart', function (event) {
        console.log('in listener')
        if (event.url && ((event.url).indexOf(logout_redirect_url) === 0)) {
          browserRef.removeEventListener("exit", closeCallback);
          browserRef.close();
          console.log(event.url);
          resolve()
        }
      });

    });
  }

  getLocalJson(url ){
    console.log(url);
   return this.ngHttp.get(url);
    // this.ngHttp.get("assets/addObservation.json").subscribe(data => {
    // }).catch(error => {

    //   console.log(JSON.stringify(error));
    //   const errorDetails = error['error'] ? JSON.parse(error['error']) : error ;
    //   if (errorDetails.status === "ERR_TOKEN_INVALID") {
    //     this.errorTokenRetryCount++;
    //   } else {
    //     this.utils.openToast(error.message, 'Ok');
    //     const errorObject = { ...this.errorObj };
    //     errorObject.text = `API failed. URL: ${url}. Error  Details ${JSON.stringify(error)}`;
    //     this.slack.pushException(errorObject);
    //   }
    // })
    // console.log(url);

    // this.http.get(url , { } , {}).then(data => 
    //   {
    //     console.log("function sucess");
    //     console.log(JSON.stringify(data.data));
    //   successCallback(JSON.parse(data.data));

    //   }).catch( error =>{

    //   });  
  }
} 
