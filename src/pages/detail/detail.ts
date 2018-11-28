import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private iab: InAppBrowser) {
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

}
