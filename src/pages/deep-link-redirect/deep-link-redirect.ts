import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DeeplinkProvider } from '../../providers/deeplink/deeplink';

/**
 * Generated class for the DeepLinkRedirectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: "page-deep-link-redirect",
  templateUrl: "deep-link-redirect.html",
})
export class DeepLinkRedirectPage {
  data: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public deeplinkProvider: DeeplinkProvider) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad DeepLinkRedirectPage");
    this.data = this.navParams.data;
    let key = Object.keys(this.data);
    this.switch(key);
  }

  switch(key) {
    switch (key) {
      case "observationLink":
        this.redirectObservation(this.data[key]);
        break;

      default:
        break;
    }
  }

  redirectObservation(link) {
    // this.deeplinkProvider.createObsFromLink()
  }
}
