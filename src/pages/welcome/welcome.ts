import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides } from 'ionic-angular';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  @ViewChild(Slides) slides: Slides;

  skipMsg: string ;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.skipMsg = "Skip";
    console.log('ionViewDidLoad WelcomePage');
  }

  slideChanged(): void {
    if (this.slides.isEnd()) {
      this.skipMsg = 'Got it';
    } else {
      this.skipMsg = "Skip";
    }
  }

  navigateTo(): void {
    this.navCtrl.push(LoginPage)
  }

}
