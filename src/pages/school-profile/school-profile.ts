import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { schoolProfileConfig } from './school-profile.config';
import { UtilsProvider } from '../../providers/utils/utils';
import { Storage } from '@ionic/storage';
import { SchoolProfileEditPage } from '../school-profile-edit/school-profile-edit';
import { RatingProvider } from '../../providers/rating/rating';
import { FeedbackProvider } from '../../providers/feedback/feedback';

@IonicPage()
@Component({
  selector: 'page-school-profile',
  templateUrl: 'school-profile.html',
})
export class SchoolProfilePage {

  schoolProfile: Array<string>;
  schoolId: any;
  schoolName: string;
  isEditable: boolean;
  submissionId: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private apiService: ApiProvider,
    private utils: UtilsProvider,
    private storage: Storage,
    private ratingService: RatingProvider,
    private app: App,
    private feedback: FeedbackProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SchoolProfilePage');
    this.getSchoolDetails();
    this.schoolId = this.navParams.get('_id');
    this.schoolName = this.navParams.get('name');
    console.log(this.navParams.get('_id'))
    this.storage.get('schoolsDetails').then(data => {
      const schoolData = JSON.parse(data);
      this.schoolProfile = schoolData[this.schoolId]['schoolProfile']['form'];
      this.submissionId = schoolData[this.schoolId]['assessments'][0].submissionId;
      this.isEditable = schoolData[this.schoolId]['schoolProfile']['isEditable'];
    }).catch(error => {

    })

  }

  getSchoolDetails() {
    // this.utils.startLoader();
    // this.apiService.httpGet(schoolProfileConfig.getSchoolDetails, response => {
    //   console.log(JSON.stringify(response));
    //   this.schoolProfile = response.result.schoolProfile.formFields;
    //   this.utils.stopLoader();
    // }, error => {
    //   this.utils.stopLoader();
    // })
  }

  goToPage(): void {
    this.app.getRootNav().push('EvidenceListPage', { _id: this.schoolId, name: this.schoolName })
  }

  goToEditProfile(index): void {
    this.app.getRootNav().push(SchoolProfileEditPage, { _id: this.schoolId, name: this.schoolName })

    // this.navCtrl.push('SchoolProfilePage', { _id: this.schoolList[index]['_id'], name: this.schoolList[index]['name']})
  }

  goToRating() {
    const school = {
      _id: this.schoolId,
      name: this.schoolName
    }
    this.ratingService.checkForRatingDetails(this.submissionId, school);
  }

  goToParentInfo(): void {
      
  }

  feedBack() {
    this.feedback.sendFeedback()
  }
}
