import { Component } from '@angular/core';
import { NavController, NavParams, App, PopoverController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SchoolConfig } from '../../providers/school-list/schoolConfig';
import { ApiProvider } from '../../providers/api/api';
import { UtilsProvider } from '../../providers/utils/utils';
import { WelcomePage } from '../welcome/welcome';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { MenuItemComponent } from '../../components/menu-item/menu-item';
import { UpdateLocalSchoolDataProvider } from '../../providers/update-local-school-data/update-local-school-data';

@Component({
  selector: 'page-school-list',
  templateUrl: 'school-list.html',
})
export class SchoolListPage {

  schoolList: Array<object>;
  schoolDetails = [];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private storage: Storage, 
    private apiService: ApiProvider, private appCtrl: App,
    private utils: UtilsProvider, 
    private localStotrage: LocalStorageProvider, 
    private popoverCtrl : PopoverController,
    private ulsd: UpdateLocalSchoolDataProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SchoolListPage');
    this.utils.startLoader();
    // this.storage.get('schools').then(schools => {
    //   if (schools) {
    //     this.schoolList = schools;
    //   } else {
    //     this.getSchoolListApi();
    //   }
    //   this.utils.stopLoader();
    // }).catch(error => {
    //   this.getSchoolListApi();
    //   this.utils.stopLoader();
    // })
    this.localStotrage.getLocalStorage('schools').then(schools => {
      console.log(JSON.stringify(schools))
      this.schoolList = schools;
      this.utils.stopLoader();
    }).catch(error => {
      this.utils.stopLoader();
      // this.getSchoolListApi();
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

  getAssessmentDetails(schoolIndex) {
    this.utils.startLoader('Fetching school details.');
    this.schoolList[schoolIndex]['downloaded'] = true;
    this.localStotrage.setLocalStorage('schools', this.schoolList);
    this.apiService.httpGet(SchoolConfig.getSchoolDetails + this.schoolList[schoolIndex]['_id'], successData => {
      this.localStotrage.setLocalStorage("generalQuestions_"+this.schoolList[schoolIndex]['_id'], successData.result['assessments'][0]['generalQuestions']);
      this.localStotrage.setLocalStorage("generalQuestionsCopy_"+this.schoolList[schoolIndex]['_id'], successData.result['assessments'][0]['generalQuestions']);
      this.schoolList[schoolIndex]['downloaded'] = true;
      this.localStotrage.setLocalStorage(this.utils.getAssessmentLocalStorageKey(this.schoolList[schoolIndex]['_id']), successData.result);
      this.ulsd.mapSubmissionDataToQuestion(successData.result);
      this.utils.stopLoader();
    }, errorData => {
      this.utils.stopLoader();

    })
  }


  gotToEvidenceList(school) {
    this.appCtrl.getRootNav().push('EvidenceListPage', { _id: school._id, name: school.name, parent: this })
  }

  successCallback = (response) => {
    this.schoolDetails.push(response.result);
    if (this.schoolDetails.length === this.schoolList.length) {
      this.utils.stopLoader();
      const schoolDetailsObj = {}
      for (const school of this.schoolDetails) {
        schoolDetailsObj[school['schoolProfile']._id] = school;
      }
      this.storage.set('schoolsDetails', JSON.stringify(schoolDetailsObj));
    }
  }

  goToDetails(index): void {
    this.appCtrl.getRootNav().push('SchoolProfilePage', { _id: this.schoolList[index]['_id'], name: this.schoolList[index]['name'] })
  }



  openMenu(myEvent, index) {
    let popover = this.popoverCtrl.create(MenuItemComponent, {
      submissionId: this.schoolList[index]['submissionId'],
      _id: this.schoolList[index]['_id'],
      name: this.schoolList[index]['name'],
      // parent: this,
      programId: this.schoolList['programId']
    });
    popover.present({
      ev: myEvent
    });
  }

  ionViewWillEnter() {
    console.log("init")
  }

}
