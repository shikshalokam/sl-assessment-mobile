import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UtilsProvider } from '../../providers/utils/utils';


@IonicPage()
@Component({
  selector: 'page-rating',
  templateUrl: 'rating.html',
})
export class RatingPage {
  view: string = 'question';
  submissionId: string;
  schoolData: any;
  selectedCriteriaIndex: number;
  currentCriteria: any;
  allCriterias: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private utils: UtilsProvider,
    private storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RatingPage');
    this.submissionId = this.navParams.get('submissionId');
    this.schoolData = this.navParams.get('schoolData');
    this.selectedCriteriaIndex = this.navParams.get('selectedCriteriaIndex')
    this.storage.get('rating_' + this.submissionId).then(data => {
      if (data) {
        this.allCriterias = data;
        this.currentCriteria = this.allCriterias.criterias[this.selectedCriteriaIndex];
      } else {
      }
    }).catch(error => {

    })
  }


  saveRating(): void {
    if (this.currentCriteria.score && this.currentCriteria.remarks) {
      this.currentCriteria.isCompleted = true;
    }
    this.utils.setLocalVariable('rating_' + this.submissionId, this.allCriterias)
    this.navCtrl.pop();
  }

}
