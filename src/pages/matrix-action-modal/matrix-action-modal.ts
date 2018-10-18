import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { UtilsProvider } from '../../providers/utils/utils';


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
    this.data = Object.assign(data);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MatrixActionModalPage');
  }

  update(): void {
    for (const question of this.data.value[this.selectedIndex]) {
      question.isCompleted = this.utils.isQuestionComplete(question);
    }
    this.viewCntrl.dismiss(this.data)
  }

  cancel(): void {
    this.viewCntrl.dismiss();
  }

}
