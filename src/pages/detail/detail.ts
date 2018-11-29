import { Component } from '@angular/core';
import { NavController, NavParams, App, AlertController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { WelcomePage } from '../welcome/welcome';
import { CurrentUserProvider } from '../../providers/current-user/current-user';
import { AuthProvider } from '../../providers/auth/auth';

@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private iab: InAppBrowser,
    private app: App,
    private alertctrl: AlertController,
    private currentUser: CurrentUserProvider,
    private auth: AuthProvider) {
  }

  content: any;
  header: any;

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailPage');
    this.content = this.navParams.get('content');
    this.header = this.navParams.get("header");
  }

  openUrl(url) {
    console.log("innnn")
    const browser = this.iab.create(url);
    browser.show();
  }

  clearData() {
    let alert = this.alertctrl.create({
      title: 'WARNING',
      subTitle:'All schools survey data will be erased. This action is irreversable.Do you want to continue?',
      // message:'hiii',
      buttons: [
        {
          text: 'No',
          role: 'role',
          handler: data => {

          }
        },
        {
          text: 'Yes',
          role: 'role',
          handler: data => {
            this.auth.doLogout();
            this.currentUser.removeUser();
            let nav = this.app.getRootNav();
            nav.setRoot(WelcomePage);
          }
        }
      ],
      enableBackdropDismiss: false
    });
    alert.present();
  }

}
