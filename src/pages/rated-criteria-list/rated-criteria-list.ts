import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { FlaggingModalPage } from '../flagging-modal/flagging-modal';
import { AppConfigs } from '../../providers/appConfig';
import { ApiProvider } from '../../providers/api/api';
import { UtilsProvider } from '../../providers/utils/utils';

/**
 * Generated class for the RatedCriteriaListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-rated-criteria-list',
  templateUrl: 'rated-criteria-list.html',
})
export class RatedCriteriaListPage {
  submissionId: String;
  schoolData: any;
  ratedQuestions: any
  isFlagged: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private modalCntrl: ModalController,
    private apiService: ApiProvider,
    private utils: UtilsProvider) {
  }

  ionViewWillEnter() {
    this.submissionId = this.navParams.get('submissionId');
    this.schoolData = this.navParams.get('schoolData');
    this.ratedQuestions = this.navParams.get('data');
    // this.isFlagged = this.ratedQuestions ? this.checkIfFlagged(): false;
  }

  openFlaggingModal(index): void {
    const selectedCriteria = this.ratedQuestions.criterias[index];
    if(selectedCriteria.flagRaised){
      selectedCriteria.flag.value = selectedCriteria.flagRaised.value;
      selectedCriteria.flag.remarks = selectedCriteria.flagRaised.remarks;
      selectedCriteria.isSubmitted = true; 
    }
    let flaggingModal = this.modalCntrl.create(FlaggingModalPage, { currentCriteria: selectedCriteria, submissionId: this.submissionId });
    flaggingModal.onDidDismiss(data => {
      this.isFlagged = this.ratedQuestions ? this.checkIfFlagged() : false;
      this.ratedQuestions.criterias[index] = data ? data : this.ratedQuestions.criterias[index];
    })

    flaggingModal.present();
  }

  checkIfFlagged() {
    for (const critera of this.ratedQuestions.criterias) {
      if (critera.isFlagged) {
        return true
      }
    }
    return false
  }

  // submitFlaging(): void {
  //   this.utils.startLoader()
  //   const obj = { flag: {} };
  //   for (const criteria of this.ratedQuestions.criterias) {
  //     obj.flag[criteria._id] = {
  //       value: criteria.flag.value,
  //       remarks: criteria.flag.remarks,
  //       criteriaId: criteria._id
  //     }
  //   }
  //   console.log(JSON.stringify(obj))
  //   this.apiService.httpPost(AppConfigs.flagging.submitFlag + this.submissionId, obj, success => {
  //     this.ratedQuestions.isSubmitted = true;
  //     this.utils.openToast(success.message)
  //     this.utils.stopLoader();
  //   }, error => {
  //     this.utils.stopLoader();
  //   })
  // }

}
