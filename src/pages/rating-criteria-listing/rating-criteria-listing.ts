import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ApiProvider } from '../../providers/api/api';
import { AppConfigs } from '../../providers/appConfig';
import { UtilsProvider } from '../../providers/utils/utils';

@IonicPage()
@Component({
  selector: 'page-rating-criteria-listing',
  templateUrl: 'rating-criteria-listing.html',
})
export class RatingCriteriaListingPage {

  isEditable: boolean;
  criteriaList: any;
  school: any;
  allRatingDetails: any;
  submissionId: string;
  schoolData: any;
  enableSubmit: boolean;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private apiService: ApiProvider,
    private utils: UtilsProvider
  ) {
  }

  ionViewWillEnter() {
    console.log('ionViewDidLoad RatingCriteriaListingPage');
    this.submissionId = this.navParams.get('submissionId');
    this.schoolData = this.navParams.get('schoolData');
    this.storage.get('rating_' + this.submissionId).then(data => {
      console.log(JSON.stringify(data))
      if (data) {
        this.allRatingDetails = data;
        this.enableSubmit = this.enableSubmitButton();
      } else {
      }
    }).catch(error => {

    })
  }

  gotToRatingPage(index): void {
    this.navCtrl.push('RatingPage', { 'submissionId': this.submissionId, 'schoolData': this.school, 'selectedCriteriaIndex': index });
  }

  enableSubmitButton(): boolean {
    for (const criteria of this.allRatingDetails.criterias) {
      if (!criteria.isCompleted) {
        return false
      }
    }
    return true
  }

  saveRating() {
    this.navCtrl.pop();
  }

  submitRating(): void {
    this.utils.startLoader();
    const payload = { ratings: {} };
    for (const criteria of this.allRatingDetails.criterias) {
      payload.ratings[criteria._id] = {
        score: criteria.score,
        remarks: criteria.remarks,
        criteriaId: criteria._id
      }
    }
    this.apiService.httpPost(AppConfigs.rating.submitRatings + this.submissionId, payload,
      success => {
        this.utils.stopLoader();
        this.utils.openToast(success.message);
        this.allRatingDetails.isSubmitted = true;
        this.utils.setLocalVariable('rating_' + this.submissionId, this.allRatingDetails)
      },
      error => {
        this.utils.openToast(error.message)
        this.utils.stopLoader();
      })
  }



}
