import { HttpClient } from '@angular/common/http';
import { App } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { ApiProvider } from '../api/api';
import { UtilsProvider } from '../utils/utils';
import { AppConfigs } from '../appConfig';
import { Storage } from '@ionic/storage';

/*
  Generated class for the RatingProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RatingProvider {

  constructor(public http: HttpClient,
    private apiService: ApiProvider,
    private utils: UtilsProvider,
    private storage: Storage,
    private appCtrl: App) {
    console.log('Hello RatingProvider Provider');
  }

  checkForRatingDetails(submissionId, schoolData) {
    this.storage.get('rating_' + submissionId).then(data => {
      if (data) {
        this.appCtrl.getRootNav().push('RatingCriteriaListingPage', { 'submissionId': submissionId, 'schoolData': schoolData });
      } else {
        this.fetchRatingQuestions(submissionId, schoolData)
      }
    }).catch(error => {

    })

  }

  fetchRatingQuestions(submissionId, schoolData) {
    this.utils.startLoader();
    this.apiService.httpGet(AppConfigs.rating.fetchRatingQuestions + submissionId,
      success => {
        this.utils.stopLoader();
        if (success.result) {
          this.storage.set('rating_' + submissionId, success.result);
          this.appCtrl.getRootNav().push('RatingCriteriaListingPage', { 'submissionId': submissionId, 'schoolData': schoolData });
        } else {
          this.utils.openToast(success.message, 'Ok');
        }
      }, error => {
        this.utils.stopLoader();
      })
  }

}
