import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { schoolProfileConfig } from './school-profile.config';
import { UtilsProvider } from '../../providers/utils/utils';

/**
 * Generated class for the SchoolProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-school-profile',
  templateUrl: 'school-profile.html',
})
export class SchoolProfilePage {

  schoolProfile: Array<string>;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private apiService: ApiProvider,
    private utils: UtilsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SchoolProfilePage');
    this.getSchoolDetails();
  }

  getSchoolDetails() {
    this.utils.startLoader();
    this.apiService.httpGet(schoolProfileConfig.getSchoolDetails, response => {
      console.log(JSON.stringify(response));
      this.schoolProfile = response.result.schoolProfile.formFields;
      this.utils.stopLoader();
    }, error => {
      this.utils.stopLoader();
    })
  }

}
