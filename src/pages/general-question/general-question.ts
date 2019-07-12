import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-general-question',
  templateUrl: 'general-question.html',
})
export class GeneralQuestionPage {

  question: any;
  schoolId: any;
  submissionId: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCntrl: ViewController) {
    this.question = this.navParams.get('question');
    this.submissionId = this.navParams.get('_id');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GeneralQuestionPage');
  }

  updateLocalData() {

  }

  cancel(): void {
    this.viewCntrl.dismiss();
  }

  update(): void {
    this.viewCntrl.dismiss(this.question);
  }
}
