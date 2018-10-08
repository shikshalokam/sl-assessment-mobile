import { Component } from '@angular/core';
import { Platform, Tab, App, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../pages/login/login';
import { CurrentUserProvider } from '../providers/current-user/current-user';
import { WelcomePage } from '../pages/welcome/welcome';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  isAlertPresent: boolean = false;
  // rootPage: any = "LoginPage";

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    private currentUser: CurrentUserProvider,
    private storage: Storage, private app: App, private alertCtrl: AlertController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      this.currentUser.checkForTokens().then(response => {
        this.rootPage = TabsPage;
        splashScreen.hide()
      }).catch(error => {
        this.rootPage = WelcomePage;
        splashScreen.hide()
      })


      // this.currentUser.checkForValidToken().then(response => {
      //   this.rootPage = TabsPage;
      //   splashScreen.hide();
      // }).catch(error => {
      //   this.rootPage = LoginPage;
      //   splashScreen.hide();
      // })

      // this.storage.get('tokens').then((token) => {
      //   if (token) {

      //     this.rootPage = TabsPage;
      //   } else {
      //     this.rootPage = LoginPage;
      //   }
      //   splashScreen.hide();
      // });

    });

    platform.registerBackButtonAction(() => {
      let nav = app.getActiveNavs()[0];
      let activeView = nav.getActive();
      let alert;

      switch (activeView.name) {
        case "SchoolListPage": case "AboutPage": case 'FaqPage': case 'WelcomePage': case 'HomePage':
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

                  platform.exitApp(); // Close this application
                }
              }]
            });
            alert.present()
          };

        // default:
        //   nav.pop();
      }

    })
  }
}
