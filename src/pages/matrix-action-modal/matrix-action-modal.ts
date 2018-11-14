import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { UtilsProvider } from '../../providers/utils/utils';
import { isDefaultChangeDetectionStrategy } from '@angular/core/src/change_detection/constants';


@Component({
  selector: 'page-matrix-action-modal',
  templateUrl: 'matrix-action-modal.html',
})
export class MatrixActionModalPage {

  instanceDetails: any;
  selectedIndex: any;
  data: any;
  constructor(public navCtrl: NavController, private utils: UtilsProvider,
    public navParams: NavParams, private viewCntrl: ViewController) {
    this.selectedIndex = navParams.data.selectedIndex;
    const data = navParams.data.data;
    // this.data = Object.assign(data);
    this.data = navParams.data.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MatrixActionModalPage');
  }

  update(): void {
    for (const question of this.data.value[this.selectedIndex]) {
      console.log(question.questions + question.isCompleted);
      // Do check only for questions without visibleif. For visibleIf questions isCompleted property is set in  checkForVisibility()
      if (!question.visibleIf) {
        question.isCompleted = this.utils.isQuestionComplete(question);
      }
    }
    this.viewCntrl.dismiss(this.data)
  }

  cancel(): void {
    this.viewCntrl.dismiss();
  }

  checkForVisibility(currentQuestionIndex): boolean {
    let visibility = false;
    const currentQuestion = this.data.value[this.selectedIndex][currentQuestionIndex];
    if (currentQuestion.visibleIf && currentQuestion.visibleIf.length) {
      this.data.value[this.selectedIndex].forEach((question) => {
        const evaluatedCondition = eval('"' + question.value + '"' + currentQuestion.visibleIf[0].operator + '"' + currentQuestion.visibleIf[0].value + '"');
        if (question._id === currentQuestion.visibleIf[0]._id && evaluatedCondition) {
          visibility = true;
        question.isCompleted = this.utils.isQuestionComplete(currentQuestion);
        } else {
        question.isCompleted = true;
        }
      });
      return visibility
    } else {
      return true
    }

  }

}
