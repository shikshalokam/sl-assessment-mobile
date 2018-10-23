import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { UtilsProvider } from '../../providers/utils/utils';
import { ApiProvider } from '../../providers/api/api';
import { AppConfigs } from '../../providers/appConfig';


@Component({
  selector: 'page-flagging-modal',
  templateUrl: 'flagging-modal.html',
})
export class FlaggingModalPage {
  currentCriteria: any;
  submissionId: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private viewCtrl: ViewController, private utils: UtilsProvider,
    private apiService: ApiProvider) {
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad FlaggingModalPage');
    this.currentCriteria = this.navParams.get('currentCriteria');
    this.submissionId = this.navParams.get("submissionId");
  }

  cancel(): void {
    this.viewCtrl.dismiss();
  }

  saveData(): void {
    if (this.currentCriteria.flag.value && this.currentCriteria.flag.remarks) {
      // this.currentCriteria.isFlagged = true;
      this.submitFlaging();
    } else {
      this.currentCriteria.isFlagged = false;
    }
    this.viewCtrl.dismiss(this.currentCriteria)
  }

  submitFlaging(): void {
    this.utils.startLoader()
    const obj = { flag: {} };
    // for (const criteria of this.ratedQuestions.criterias) {
    obj.flag[this.currentCriteria._id] = {
      value: this.currentCriteria.flag.value,
      remarks: this.currentCriteria.flag.remarks,
      criteriaId: this.currentCriteria._id
    }
    // }
    console.log(JSON.stringify(obj))
    this.apiService.httpPost(AppConfigs.flagging.submitFlag + this.submissionId, obj, success => {
      this.currentCriteria.isSubmitted = true;
      this.utils.openToast(success.message)
      this.utils.stopLoader();
      this.currentCriteria.flagRaised = {
        value: this.currentCriteria.flag.value,
        remarks: this.currentCriteria.flag.remarks
      };
      this.viewCtrl.dismiss(this.currentCriteria)
    }, error => {
      this.utils.stopLoader();
    })
  }
}
