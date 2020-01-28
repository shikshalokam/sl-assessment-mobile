import { Component } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AppConfigs } from '../../providers/appConfig';
import { Http, URLSearchParams } from '@angular/http';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CurrentUserProvider } from '../../providers/current-user/current-user';
import { HomePage } from '../home/home';
import { UtilsProvider } from '../../providers/utils/utils';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { HTTP } from '@ionic-native/http';
import { FcmProvider } from '../../providers/fcm/fcm';

@Component({
  selector: 'page-user-login',
  templateUrl: 'user-login.html',
})
export class UserLoginPage {

  private signIn: FormGroup;
  auth_url;
  counter = 0;;
  paylod = {}
  password;
  staffID;
  adminToken;
  userDetails;

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private utils: UtilsProvider,
    private currentUser: CurrentUserProvider, private app: App, private navCtrl: NavController, private ionicHttp: HTTP,
    private localStorage: LocalStorageProvider, private fcm: FcmProvider) {
    this.signIn = this.formBuilder.group({
      staffID: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  checkForKeycloakUser(username, password) {
    const params = new HttpParams({
      fromObject: {
        grant_type: 'password',
        username: username,
        password: AppConfigs.adminCredentials.userPassword,
        client_id: AppConfigs.clientId,
        scope: "offline_access"
      }
    });

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      })
    };
    const url = AppConfigs.app_url + "/auth/realms/sunbird/protocol/openid-connect/token";
    this.http.post(url, params, httpOptions)
      .subscribe((data: any) => {
        this.utils.stopLoader();
        let userTokens = {
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          // idToken: data.id_token
        };
        this.currentUser.setCurrentUserDetails(userTokens).then(success => {
          this.fcm.registerDeviceID();
          let nav = this.app.getActiveNav();
          nav.setRoot(HomePage);
        })
      }, error => {
        this.adminLogin();
      });
  }

  adminLogin() {
    const params = new HttpParams({
      fromObject: {
        grant_type: 'password',
        username: AppConfigs.adminCredentials.username,
        password: AppConfigs.adminCredentials.password,
        client_id: AppConfigs.clientId
      }
    });

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      })
    };
    const url = AppConfigs.app_url + "/auth/realms/sunbird/protocol/openid-connect/token";
    this.http.post(url, params, httpOptions)
      .subscribe((data: any) => {
        this.adminToken = data.access_token;
        this.createUser();
      }, error => {
        console.log(JSON.stringify(error))
        this.utils.stopLoader();
        this.utils.openToast("Please try again.");
      });
  }

  createUser() {
    const body = {
      "params": {},
      "request": {
        "channel": AppConfigs.adminCredentials.adminChanel,
        "firstName": this.userDetails.staffName,
        "lastName": "",
        "email": this.signIn.value.staffID + AppConfigs.adminCredentials.userEmailExtension,
        "emailVerified": true,
        "userName": this.signIn.value.staffID,
        "password": AppConfigs.adminCredentials.userPassword
      }

    }

    const url = AppConfigs.app_url + AppConfigs.punjab.createUser;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "x-authenticated-user-token": this.adminToken,
        "Authorization": AppConfigs.adminCredentials.auterizationToken
      })
    };

    this.http.post(url, body, httpOptions)
      .subscribe((data: any) => {
        this.checkForKeycloakUser(this.signIn.value.staffID, this.signIn.value.password)
      }, error => {
        this.utils.stopLoader();
        this.utils.openToast("Invalid UserID & Password !!!");
      });

  }

  logForm() {
    const params = new HttpParams({
      fromObject: {
        staffID: this.paylod['staffID'],
        password: this.paylod['password'],
        key: AppConfigs.punjabApiKey
      }
    });
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      })
    };
    this.http.post(AppConfigs.punjabBaseUrl + AppConfigs.punjab.login, params, httpOptions).subscribe(success => {
    }, error => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(error.error.text, "text/xml");
      try {
        this.userDetails = JSON.parse(xmlDoc.getElementsByTagName('string')[0].childNodes[0].nodeValue)[0];
        this.localStorage.setLocalStorage("partnerLoginDetails", this.userDetails);
        this.checkForKeycloakUser(this.signIn.value.staffID, this.signIn.value.password)
      } catch (e) {
        this.utils.stopLoader();
        this.utils.openToast("Invalid UserID & Password !!!");
      }
    })
  }

  login() {
    const payload = {
      staffID: this.paylod['staffID'],
      password: this.paylod['password'],
      key: AppConfigs.punjabApiKey
    };
    const obj = {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
    this.ionicHttp.post(AppConfigs.punjabBaseUrl + AppConfigs.punjab.login, payload, obj).then(success => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(success.data, "text/xml");
      try {
        this.userDetails = JSON.parse(xmlDoc.getElementsByTagName('string')[0].childNodes[0].nodeValue)[0];
        this.localStorage.setLocalStorage("partnerLoginDetails", this.userDetails);
        this.checkForKeycloakUser(this.signIn.value.staffID, this.signIn.value.password)
      } catch (e) {
        this.utils.stopLoader();
        this.utils.openToast("Invalid UserID & Password !!!");
      }
    }).catch(error => {
      this.signIn.reset();
      this.utils.stopLoader();
      this.paylod = {};
      console.log(JSON.stringify(error));
      this.staffID =""
      this.utils.openToast(error.error);
    })
  }

  goToForgotPassword() {
    this.navCtrl.push(ForgotPasswordPage)
  }

  encryptParams(stringToEncrypt) {
    if (this.counter === 0) {
      this.utils.startLoader()
    }
    const params = new HttpParams({
      fromObject: {
        'values': stringToEncrypt ? stringToEncrypt : this.signIn.value.staffID,
        'key': AppConfigs.punjabApiKey
      }
    });

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      })
    };

    this.http.post(AppConfigs.punjabBaseUrl + AppConfigs.punjab.encryptedMethod, params, httpOptions).subscribe(success => {
    }, error => {
      let encryptedString = (error.error.text.split('<string xmlns="http://tempuri.org/">'))[1].split('</string>')[0];
      if (this.counter === 0) {
        this.staffID = encryptedString
        this.counter++;
        this.encryptParams(this.signIn.value.password)
      } else {
        this.paylod = {
          staffID: this.staffID,
          password: encryptedString,
          key: AppConfigs.punjabApiKey
        };
        console.log(JSON.stringify(this.paylod))
        this.counter = 0;
        this.login();
      }
    })

  }

}
