import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the SolutionDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-solution-details',
  templateUrl: 'solution-details.html',
})
export class SolutionDetailsPage {
  frameWork: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl : ViewController,
     ) {
       this.frameWork = this.navParams.get('data');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SolutionDetailsPage');
  }
  closeModal(){
    this.viewCtrl.dismiss();

  }
}
