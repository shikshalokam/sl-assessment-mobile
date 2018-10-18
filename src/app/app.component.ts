import { Component, ViewChild } from '@angular/core';
import { Platform, Tab, App, AlertController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { CurrentUserProvider } from '../providers/current-user/current-user';
import { WelcomePage } from '../pages/welcome/welcome';
import { UtilsProvider } from '../providers/utils/utils';
import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  isAlertPresent: boolean = false;
  // rootPage: any = "LoginPage";

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private currentUser: CurrentUserProvider,
    private alertCtrl: AlertController,
    private utils: UtilsProvider,
    private translate: TranslateService
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.initilaizeApp();
      this.registerBAckButtonAction();
      this.initTranslate();
    });
  }

  initTranslate() {
    this.translate.setDefaultLang('en');


    // if (this.translate.getBrowserLang() !== undefined) {
    //   console.log("language")
    //     this.translate.use(this.translate.getBrowserLang());
    // } else {
    //     this.translate.use('hi'); // Set your language here
    // }

}

  initilaizeApp(): void {
    this.statusBar.styleDefault();
    this.currentUser.checkForTokens().then(response => {
      this.rootPage = TabsPage;
      this.splashScreen.hide()
    }).catch(error => {
      this.rootPage = WelcomePage;
      this.splashScreen.hide()
    })
    this.statusBar.styleDefault();
  }

  registerBAckButtonAction(): void {
    this.platform.registerBackButtonAction(() => {
      let alert;
      // this.nav.indexOf('WelcomePage')
      // console.log("hiii "+ JSON.stringify(this.nav.getByIndex(0)))
      if (this.nav.length() > 1) {
        this.nav.pop();
      } else {
        if (!this.isAlertPresent) {
          this.isAlertPresent = true;
          alert = this.alertCtrl.create({
            title: 'App termination',
            message: 'Do you want to close the app?',
            enableBackdropDismiss: false,
            buttons: [{
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                console.log('Application exit prevented!');
                this.isAlertPresent = false;
              }
            }, {
              text: 'Close App',
              handler: () => {
                this.platform.exitApp(); // Close this application
              }
            }]
          });
          alert.present()
        }
      }
    })
  }

}
