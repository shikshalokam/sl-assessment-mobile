import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  language;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private localStorage: LocalStorageProvider,
    private translateServ: TranslateService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
    this.localStorage.getLocalStorage('language').then(success => {
      this.language = success ?  success : 'en';
    }).catch(error => {
      this.language = 'en';
    })
  }

  setLanguage(e) {
    this.translateServ.use(e);
    this.localStorage.setLocalStorage('language', e);
  }
  

}
