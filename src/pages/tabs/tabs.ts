import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { HomePage } from '../home/home';
import { SchoolListPage } from '../school-list/school-list';
import { AuthProvider } from '../../providers/auth/auth';
import { CurrentUserProvider } from '../../providers/current-user/current-user';
import { NavController, AlertController } from 'ionic-angular';
import { FaqPage } from '../faq/faq';
import { UtilsProvider } from '../../providers/utils/utils';
import { NetworkGpsProvider } from '../../providers/network-gps/network-gps';
import { FeedbackProvider } from '../../providers/feedback/feedback';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab0Root = HomePage;
  tab1Root = SchoolListPage;
  tab2Root = FaqPage;
  tab3Root = AboutPage;

  header: string = 'Schools';
  captcha: string;
  isNetworkAvailabe: any;
  subscription: any;

  constructor(private auth: AuthProvider, private navCtrl: NavController,
    private currentUser: CurrentUserProvider,
    private utils: UtilsProvider, private alertCntrl: AlertController,
    private ngps: NetworkGpsProvider, private feedback: FeedbackProvider) {
    this.selectedTab(0);
    this.subscription = this.ngps.networkStatus$.subscribe(val => {
      this.isNetworkAvailabe = val;
      console.log(val)
    })
  }

  ionViewWillLeave() {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ionViewDidLoad() {
    this.isNetworkAvailabe = this.ngps.getNetworkStatus();
  }

  selectedTab(index): void {
    switch (index) {
      case 0: default:
        this.header = "headings.home";
        this.generateCaptcha();
        break;
      case 1:
        this.header = "headings.school";
        break;
      case 2:
        this.header = "headings.faqs";
        break;
      case 3:
        this.header = "headings.about";
        break;
    }
  }

  feedBack() {
    this.feedback.sendFeedback()
  }

  logout() {
    const logoutConfirmAlert = this.alertCntrl.create({
      title: 'Logout',
      message: '<ion-icon name="hand"></ion-icon> You will loose all the data saved locally.Do you really want to logout?',
      enableBackdropDismiss: false,
      buttons: [{
        text: 'No',
        role: 'cancel',
        handler: () => {
        }
      }, {
        text: 'Yes',
        handler: () => {
          this.generateCaptcha();
          this.logoutConfirm()
        }
      }]
    });
    logoutConfirmAlert.present()
    // this.auth.doLogout().then(response => {
    //   this.currentUser.removeUser();
    //   this.app.getRootNav().push(WelcomePage)
    // })
  }

  logoutConfirm() {
    const logoutVerifyAlert = this.alertCntrl.create({
      title: 'Confirm Logout',
      subTitle: "Please enter the code to confirm. ",
      message: this.captcha,
      enableBackdropDismiss: false,
      inputs: [
        {
          name: 'captcha',
          placeholder: 'Captcha',
        }
      ],
      cssClass: '_alertCustomCss',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
        }
      }, {
        text: 'Confirm',
        handler: data => {
          if (data.captcha === this.captcha) {
            this.auth.doLogout().then(response => {
              this.currentUser.deactivateActivateSession(true);
              // this.app.getActiveNav().setRoot(WelcomePage);
              // this.currentUser.removeUser();
              // this.navCtrl.setRoot(WelcomePage);
              // this.app.getRootNav().push(WelcomePage)
            })
          } else {
            this.utils.openToast('Logout code miss match.Please try to logout again.', 'Ok')
          }

        }
      }]
    });
    logoutVerifyAlert.present()
  }

  goToProfile() {
    this.navCtrl.push('SchoolProfilePage');
  }

  generateCaptcha() {
    let alpha = new Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9');
    for (let i = 0; i < 6; i++) {
      var a = alpha[Math.floor(Math.random() * alpha.length)];
      var b = alpha[Math.floor(Math.random() * alpha.length)];
      var c = alpha[Math.floor(Math.random() * alpha.length)];
      var d = alpha[Math.floor(Math.random() * alpha.length)];
      var e = alpha[Math.floor(Math.random() * alpha.length)];
      var f = alpha[Math.floor(Math.random() * alpha.length)];
      // var g = alpha[Math.floor(Math.random() * alpha.length)];
    }
    this.captcha = a + b + c + d + e + f;
    console.log(this.captcha)
  }
}
