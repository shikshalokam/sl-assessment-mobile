import { Component } from '@angular/core';
import { NavController, NavParams , ViewController} from 'ionic-angular';
import { UtilsProvider } from '../../providers/utils/utils';


/**
 * Generated class for the QuestionDashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-question-dashboard',
  templateUrl: 'question-dashboard.html',
})
export class QuestionDashboardPage {

  questions: any;
  evidenceMethod: string;
  sectionName: string;
  currentViewIndex: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private utils: UtilsProvider, private viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad QuestionDashboardPage');
    this.questions = this.navParams.get('questions')['questions'];
    //console.log(JSON.stringify(this.navParams.get('questions')['questions']))
    this.evidenceMethod = this.navParams.get('questions')['evidenceMethod'];
    this.sectionName = this.navParams.get('questions')['sectionName'];
    this.currentViewIndex = this.navParams.get('questions')['currentViewIndex'];
    //console.log(this.currentViewIndex)
  }

  isQuestionComplete(question){
    if(question.responseType.toLowerCase() === 'matrix'){
      return this.utils.isMatrixQuestionComplete(question);
    } else {
      return this.utils.isQuestionComplete(question);
    }
  }

  goToQuestion(index) {
    this.viewCtrl.dismiss(index);
  }


}
