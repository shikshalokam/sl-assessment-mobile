import { Component } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SchoolConfig } from '../../providers/school-list/schoolConfig';
import { ApiProvider } from '../../providers/api/api';
import { UtilsProvider } from '../../providers/utils/utils';
import { WelcomePage } from '../welcome/welcome';

@Component({
  selector: 'page-school-list',
  templateUrl: 'school-list.html',
})
export class SchoolListPage {

  schoolList: Array<object>;
  schoolDetails = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private apiService: ApiProvider, private appCtrl: App,
   private utils: UtilsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SchoolListPage');
    this.utils.startLoader();
    this.storage.get('schools').then(schools => {
      if (schools) {
        this.schoolList = schools;
      } else {
        this.getSchoolListApi();
      }
      this.utils.stopLoader();
    }).catch(error => {
      this.getSchoolListApi();
      this.utils.stopLoader();
    })
  }

  getSchoolListApi(): void {
    console.log('School list')
    this.utils.startLoader();
    this.apiService.httpGet(SchoolConfig.getSchoolsOfAssessors, response => {
      this.schoolList = response.result;
      // console.log(JSON.stringify(this.schoolList));
      this.storage.set('schools', this.schoolList);
      this.getSchoolDetails();
    }, error => {
      this.utils.stopLoader();
      if (error.status == '401') {
        // this.currentUser.removeUser();
        this.appCtrl.getRootNav().push(WelcomePage);
      }
    })
  }

  getSchoolDetails(): void {
    // this.utils.startLoader();
    for (const school of this.schoolList) {
      console.log(school['_id']);
      this.apiService.httpGet(SchoolConfig.getSchoolDetails + school['_id'], this.successCallback, error => {

      })
    }
    // const urls = [];
    // for (const school of this.schoolList) {
    //   let url = SchoolConfig.getSchoolDetails + school['_id'];
    //   urls.push(url)
    // }
    // this.utils.startLoader();

    // this.apiService.httpGetJoin(urls, response => {
    //   this.utils.stopLoader();
    //   console.log(JSON.stringify(response));
    //   const schoolDetailsObj = {};
    //   for (const school of response.result) {
    // schoolDetailsObj[school._id] = school;
    //   }
    // this.storage.set('schoolsDetails', JSON.stringify(schoolDetailsObj));
    // })
  }

  successCallback = (response) => {
    // console.log('school details')
    // console.log(JSON.stringify(response));
    this.schoolDetails.push(response.result);
    if (this.schoolDetails.length === this.schoolList.length) {
      this.utils.stopLoader();
      // console.log(JSON.stringify(this.schoolDetails));
      // console.log("in")
      const schoolDetailsObj = {}
      for (const school of this.schoolDetails) {
        console.log(school['schoolProfile']._id +' 2nd');
        schoolDetailsObj[school['schoolProfile']._id] = school;
      }
      console.log(JSON.stringify(this.schoolDetails));
      this.storage.set('schoolsDetails', JSON.stringify(schoolDetailsObj));
      // this.utils.stopLoader();
    }
  }

  goToDetails(index): void {
    this.appCtrl.getRootNav().push('SchoolProfilePage', { _id: this.schoolList[index]['_id'], name: this.schoolList[index]['name']})

    // this.navCtrl.push('SchoolProfilePage', { _id: this.schoolList[index]['_id'], name: this.schoolList[index]['name']})
  }

  ionViewWillEnter() {
    console.log("init")
  }

}
