import { Injectable } from "@angular/core";
import { Http, URLSearchParams } from '@angular/http';
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { AppConfigs } from "../appConfig";
import { CurrentUserProvider } from "../current-user/current-user";
import { App, AlertController } from "ionic-angular";
import { TabsPage } from "../../pages/tabs/tabs";
import { UtilsProvider } from "../utils/utils";

@Injectable()
export class AuthProvider {

  redirect_url: string;

  logout_url: string;

  auth_url: string;

  base_url: string;

  logout_redirect_url: string;

  constructor(public http: Http,
    public iab: InAppBrowser,
    private currentUser: CurrentUserProvider,
    private app: App, private alertCntrl: AlertController,
    private utils: UtilsProvider) { }

  doOAuthStepOne(): Promise<any> {


    this.base_url = AppConfigs.app_url;
    this.redirect_url = AppConfigs.keyCloak.redirection_url;
    this.auth_url = this.base_url + "/auth/realms/sunbird/protocol/openid-connect/auth?response_type=code&scope=openid&client_id=sl-ionic-connect&redirect_uri=" +
      this.redirect_url;

    let that = this;
    return new Promise(function (resolve, reject) {

      let closeCallback = function (event) {
        reject("The Sunbird sign in flow was canceled");
      };

      let browserRef = (<any>window).cordova.InAppBrowser.open(that.auth_url, "_blank", "zoom=no");
      browserRef.addEventListener('loadstop', function (event) {
        if (event.url && ((event.url).indexOf(that.redirect_url) === 0)) {
          browserRef.removeEventListener("exit", closeCallback);
          browserRef.close();
          let responseParameters = (((event.url).split("?")[1]).split("="))[1];

          if (responseParameters !== undefined) {
            resolve(responseParameters);
          } else {
            reject("Problem authenticating with Sunbird");
          }
        }
      });

    });
  }

  doOAuthStepTwo(token: string): Promise<any> {
    const body = new URLSearchParams();
    body.set('grant_type', "authorization_code");
    body.set('client_id', "sl-ionic-connect");
    body.set('code', token);
    body.set('redirect_uri', this.redirect_url);
    body.set('scope', "offline_access");
    return new Promise(resolve => {
      this.http.post(this.base_url + AppConfigs.keyCloak.getAccessToken, body)
        .subscribe((data: any) => {
          let parsedData = JSON.parse(data._body);
          let userTokens = {
            accessToken: parsedData.access_token,
            refreshToken: parsedData.refresh_token,
            idToken: parsedData.id_token
          };
          resolve(parsedData);
        }, error => {
          resolve(error);
        });
    });
  }


  checkForCurrentUserLocalData(tokens) {
    const loggedinUserId = this.currentUser.getDecodedAccessToken(tokens.access_token).sub;
    const currentUserId = this.currentUser.getCurrentUserData() ? this.currentUser.getCurrentUserData().sub : null;
    if (loggedinUserId === currentUserId || !currentUserId) {
      let userTokens = {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        idToken: tokens.id_token,
        isDeactivated: false
      };
      this.currentUser.setCurrentUserDetails(userTokens);
      let nav = this.app.getActiveNav();
      nav.setRoot(TabsPage);
      // this.confirmPreviousUserName('as1@shikshalokamdev', tokens);

    } else {
      this.confirmPreviousUserName(this.currentUser.getCurrentUserData().preferred_username, tokens);
    }
  }

  confirmPreviousUserName(previousUserEmail, tokens): void {
    let alert = this.alertCntrl.create({
      title: 'Please enter previous username.',
      inputs: [
        {
          name: 'email',
          placeholder: 'Email',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
            this.currentUser.deactivateActivateSession(true);
            this.doLogout();
          }
        },
        {
          text: 'Send',
          role: 'role',
          handler: data => {
            console.log(data.email + " " +previousUserEmail )
            if (data.email && (previousUserEmail.toLowerCase() === data.email.toLowerCase())) {
              this.confirmDataClear(tokens);
            } else {
              this.currentUser.deactivateActivateSession(true);

              this.doLogout();
              this.utils.openToast("Username didnot match. Please login again.", "Ok")
            }

          }
        }
      ]
    });
    alert.present();
  }

  confirmDataClear(tokens): void {
    let alert = this.alertCntrl.create({
      title: 'All your datas will be lost. Do you want to continue?',

      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: data => {
            this.currentUser.deactivateActivateSession(true);

            this.doLogout();
            this.utils.openToast("Please login again.", "Ok")
          }
        },
        {
          text: 'yes',
          role: 'role',
          handler: data => {
            this.currentUser.removeUser();
            let userTokens = {
              accessToken: tokens.access_token,
              refreshToken: tokens.refresh_token,
              idToken: tokens.id_token,
              isDeactivated: false
            };
            this.currentUser.setCurrentUserDetails(userTokens);
            let nav = this.app.getActiveNav();
            nav.setRoot(TabsPage);
          }
        }
      ]
    });
    alert.present();
  }

  getRefreshToken(): Promise<any> {

    return new Promise(function (resolve, reject) {
      console.log("Refres token function");
      const body = new URLSearchParams();
      body.set('grant_type', "refresh_token");
      body.set('client_id', "sl-ionic-connect");
      body.set('refresh_token', this.currentUser.curretUser.refreshToken);
      // body.set('scope', "offline_access");
      console.log('refresh_token ' + this.currentUser.curretUser)
      console.log(this.currentUser.curretUser.refreshToken);
      console.log(AppConfigs.app_url + AppConfigs.keyCloak.getAccessToken);

      this.http.post(AppConfigs.app_url + AppConfigs.keyCloak.getAccessToken, body)
        .subscribe((data: any) => {
          console.log(JSON.stringify(data))
          console.log(JSON.parse(data._data));
          let parsedData = JSON.parse(data._body);

          let userTokens = {
            accessToken: parsedData.access_token,
            refreshToken: parsedData.refresh_token,
            idToken: parsedData.id_token
          };
          this.currentUser.setCurrentUserDetails(userTokens);
          resolve(userTokens)
        }, error => {
          console.log('error ' + JSON.stringify(error));
          reject();
        })
    })

  }

  doLogout(): Promise<any> {
    return new Promise(function (resolve) {
      let logout_redirect_url = AppConfigs.keyCloak.logout_redirect_url;
      let logout_url = AppConfigs.app_url + "/auth/realms/sunbird/protocol/openid-connect/logout?redirect_uri=" + logout_redirect_url;
      console.log(logout_url);

      let closeCallback = function (event) {
      };

      let browserRef = (<any>window).cordova.InAppBrowser.open(logout_url, "_blank", "zoom=no");
      browserRef.addEventListener('loadstop', function (event) {
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

}