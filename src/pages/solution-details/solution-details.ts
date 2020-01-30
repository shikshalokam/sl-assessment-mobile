import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { AppConfigs } from '../../providers/appConfig';

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
  questions: Array<Object>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl : ViewController,
    private apiService: ApiProvider
     ) {
       this.frameWork = this.navParams.get('data');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SolutionDetailsPage');
    this.getSolutionList();
  }

  getSolutionList() {
    this.apiService.httpGet(AppConfigs.cro.solutionQuestionList+this.frameWork._id, success => {
      this.questions = success.result.questions;
    }, error => {})
  }
  closeModal(){
    this.viewCtrl.dismiss();

  }
}
