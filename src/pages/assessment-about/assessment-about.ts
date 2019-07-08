import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AssessmentAboutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-assessment-about',
  templateUrl: 'assessment-about.html',
})
export class AssessmentAboutPage {
  data ;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
   this.data =  this.navParams.get('data');
   console.log(JSON.stringify(this.data))
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AssessmentAboutPage');
  }

}
