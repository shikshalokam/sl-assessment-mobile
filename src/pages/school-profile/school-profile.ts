import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { schoolProfileConfig } from './school-profile.config';
import { UtilsProvider } from '../../providers/utils/utils';
import { Storage } from '@ionic/storage';

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
  schoolId: any;
  schoolName: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private apiService: ApiProvider,
    private utils: UtilsProvider,
    private storage: Storage,
    private app: App) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SchoolProfilePage');
    this.getSchoolDetails();
    this.schoolId = this.navParams.get('_id');
    this.schoolName = this.navParams.get('name');
    console.log(this.navParams.get('_id'))
    this.storage.get('schoolsDetails').then(data => {
      const schoolData = JSON.parse(data);
      this.schoolProfile = schoolData[this.schoolId]['SchoolProfile']['formFields'];
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
    this.app.getRootNav().push('EvidenceListPage', { _id: this.schoolId, name: this.schoolName})
  }


}
