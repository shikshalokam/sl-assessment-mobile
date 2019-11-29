import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  language;

  constructor(public navCtrl: NavController, public navParams: NavParams, private translateServ: TranslateService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
    this.language = 'en';
  }

  setLanguage(e) {
    console.log(e)
    this.translateServ.use(e)
  }
  

}
