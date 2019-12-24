import { Injectable } from "@angular/core";
import { URLSearchParams } from '@angular/http';
import { AppConfigs } from "../appConfig";
import { CurrentUserProvider } from "../current-user/current-user";
import { App, AlertController } from "ionic-angular";

import { UtilsProvider } from "../utils/utils";
import { HomePage } from "../../pages/home/home";
import { TranslateService } from "@ngx-translate/core";
import { NotificationProvider } from "../notification/notification";
import { FcmProvider } from "../fcm/fcm";

import { DomSanitizer } from "@angular/platform-browser";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { HTTP } from "@ionic-native/http";

@Injectable()
export class AuthProvider {

  redirect_url: string;

  logout_url: string;

  auth_url: string;

  base_url: string;

  logout_redirect_url: string;
  browserReference;

  constructor(public http: HTTP,
    private currentUser: CurrentUserProvider,
    private app: App, private alertCntrl: AlertController,
    private translate:TranslateService,
    private notifctnService: NotificationProvider,
    private fcm :FcmProvider,
    private samnitizer: DomSanitizer,
    private iab: InAppBrowser,
    private utils: UtilsProvider) { }

  sanitizeUrl(url) {
    return this.samnitizer.bypassSecurityTrustUrl;
  }

  doOAuthStepOne(): Promise<any> {
    this.base_url = AppConfigs.app_url;
    this.redirect_url = AppConfigs.keyCloak.redirection_url;
    this.auth_url = this.base_url + "/auth/realms/sunbird/protocol/openid-connect/auth?response_type=code&scope=offline_access&client_id=" + AppConfigs.clientId + "&redirect_uri=" +
      this.redirect_url;

    return new Promise((resolve, reject) => {
      this.browserReference = this.iab.create(this.auth_url, "_target");
      this.browserReference.show();

      this.browserReference.on('loadstart').subscribe(event => {
        if (event.url && ((event.url).indexOf(this.redirect_url) === 0)) {
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
    console.log("inside auth 2 action")
    const body = new URLSearchParams();
    body.set('grant_type', "authorization_code");
    body.set('client_id', AppConfigs.clientId);
    body.set('code', token);
    body.set('redirect_uri', this.redirect_url);
    body.set('scope', "offline_access");
    const obj = {
      "grant_type": "authorization_code",
      "client_id": AppConfigs.clientId,
      "code": token,
      "redirect_uri": this.redirect_url,
      "scope": "offline_access"
    }
    this.utils.startLoader();
    return new Promise((resolve, reject) => {
      // this.http.post(this.base_url + AppConfigs.keyCloak.getAccessToken, body)
      //   .subscribe((data: any) => {
      //     this.utils.stopLoader();
      //     let parsedData = JSON.parse(data._body);
      //     this.browserReference.close();
      //     resolve(parsedData);
      //   }, error => {
      //     this.utils.stopLoader();
      //     reject(error);
      //   });

      this.http.post(this.base_url + AppConfigs.keyCloak.getAccessToken, obj, {}).then(data => {
        this.utils.stopLoader();
        let parsedData = JSON.parse(data.data);
        this.browserReference.close();
        resolve(parsedData);
      }).catch(error => {
        this.utils.stopLoader();

      })
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
      this.currentUser.setCurrentUserDetails(userTokens).then(success => {
        let nav = this.app.getActiveNav();
        this.notifctnService.startNotificationPooling();
        this.fcm.registerDeviceID();
        nav.setRoot(HomePage);
      });

      // this.confirmPreviousUserName('as1@shikshalokamdev', tokens);

    } else {
      this.confirmPreviousUserName(this.currentUser.getCurrentUserData().preferred_username, tokens);
    }
  }

  confirmPreviousUserName(previousUserEmail, tokens): void {
    let translateObject;
    this.translate.get(['actionSheet.previousUserName', 'actionSheet.email', 'actionSheet.cancel', 'actionSheet.send']).subscribe(translations => {
      translateObject = translations;
    })
    let alert = this.alertCntrl.create({
      title: translateObject['actionSheet.previousUserName'],
      inputs: [
        {
          name: translateObject['actionSheet.email'],
          placeholder: 'Email',
        }
      ],
      buttons: [
        {
          text: translateObject['actionSheet.cancel'],
          role: 'cancel',
          handler: data => {
            this.currentUser.deactivateActivateSession(true);
            this.doLogout();
          }
        },
        {
          text: translateObject['actionSheet.send'],
          role: 'role',
          handler: data => {
            if (data.email && (previousUserEmail.toLowerCase() === data.email.toLowerCase())) {
              this.confirmDataClear(tokens);
            } else {
              this.currentUser.deactivateActivateSession(true);

              this.doLogout();
              this.translate.get(['toastMessage.userNameMisMatch', 'toastMessage.ok']).subscribe(translations => {
                this.utils.openToast(translations.userNameMisMatch, translations.ok);
              })
            }

          }
        }
      ]
    });
    alert.present();
  }

  confirmDataClear(tokens): void {
    let translateObject;
    this.translate.get(['actionSheet.dataLooseConfirm', 'actionSheet.no', 'actionSheet.yes']).subscribe(translations => {
      translateObject = translations;
    })

    let alert = this.alertCntrl.create({
      title: translateObject['actionSheet.dataLooseConfirm'],

      buttons: [
        {
          text: translateObject['actionSheet.no'],
          role: 'cancel',
          handler: data => {
            this.currentUser.deactivateActivateSession(true);

            this.doLogout();
            this.translate.get(['toastMessage.loginAgain', 'toastMessage.ok']).subscribe(translations => {
              this.utils.openToast(translations.loginAgain, translations.ok);
            })
          }
        },
        {
          text: translateObject['actionSheet.yes'],
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
            nav.setRoot(HomePage);
          }
        }
      ]
    });
    alert.present();
  }

  getRefreshToken(): Promise<any> {

    return new Promise(function (resolve, reject) {
      const body = new URLSearchParams();
      body.set('grant_type', "refresh_token");
      body.set('client_id', AppConfigs.clientId);
      body.set('refresh_token', this.currentUser.curretUser.refreshToken);
      // body.set('scope', "offline_access");

      this.http.post(AppConfigs.app_url + AppConfigs.keyCloak.getAccessToken, body)
        .subscribe((data: any) => {
          let parsedData = JSON.parse(data._body);

          let userTokens = {
            accessToken: parsedData.access_token,
            refreshToken: parsedData.refresh_token,
            idToken: parsedData.id_token
          };
          this.currentUser.setCurrentUserDetails(userTokens);
          resolve(userTokens)
        }, error => {
          reject();
        })
    })

  }

  doLogout(): Promise<any> {
    return new Promise((resolve) => {
      let logout_redirect_url = AppConfigs.keyCloak.logout_redirect_url;
      let logout_url = AppConfigs.app_url + "/auth/realms/sunbird/protocol/openid-connect/logout?redirect_uri=" + logout_redirect_url;
      let browserRef = this.iab.create(logout_url, "_blank");
      browserRef.show();
      browserRef.on('loadstart').subscribe(event => {
        if (event.url && ((event.url).indexOf(logout_redirect_url) === 0)) {
          browserRef.close();
          resolve()
        }
      })

    });
  }

}