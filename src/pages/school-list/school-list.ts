import { Component } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SchoolConfig } from '../../providers/school-list/schoolConfig';
import { ApiProvider } from '../../providers/api/api';
import { CurrentUserProvider } from '../../providers/current-user/current-user';
import { UtilsProvider } from '../../providers/utils/utils';

@Component({
  selector: 'page-school-list',
  templateUrl: 'school-list.html',
})
export class SchoolListPage {

  schoolList: Array<object>;
  constructor(public navCtrl: NavController, public navParams: NavParams
    , private storage: Storage, private apiService: ApiProvider, private appCtrl: App,
    private currentUser: CurrentUserProvider, private utils: UtilsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SchoolListPage');
    this.storage.get('schools').then(schools => {
      if (schools) {
        this.schoolList = schools;
      } else {
        this.getSchoolListApi();
      }
    }).catch(error => {
      this.getSchoolListApi();
    })
  }

  getSchoolListApi(): void {
    console.log('School list')
    this.utils.startLoader();
    this.apiService.httpGet(SchoolConfig.getSchoolsOfAssessors, response => {
      this.schoolList = response.data.schools;
      this.storage.set('schools', this.schoolList);
      this.utils.stopLoader();
    }, error => {
      this.utils.stopLoader();
      if (error.status == '401') {
        this.currentUser.removeUser();
        this.appCtrl.getRootNav().push('LoginPage');
        // this.navCtrl.setRoot('LoginPage');
      }
    })
  }

}
