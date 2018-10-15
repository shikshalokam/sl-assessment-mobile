import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { CurrentUserProvider } from '../../providers/current-user/current-user';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';
import { UtilsProvider } from '../../providers/utils/utils';
import { SchoolConfig } from '../../providers/school-list/schoolConfig';
import { WelcomePage } from '../welcome/welcome';

declare var cordova: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  userData: any;
  schoolList: Array<object>;
  schoolDetails = [];
  evidences: any;

  constructor(public navCtrl: NavController,
    private currentUser: CurrentUserProvider,
    private apiService: ApiProvider,
    private utils: UtilsProvider, private appCtrl: App,
    private storage: Storage
  ) { }

  getSchoolListApi(): void {
    this.utils.startLoader();
    this.apiService.httpGet(SchoolConfig.getSchoolsOfAssessors, response => {
      this.schoolList = response.result;
      this.storage.set('schools', this.schoolList);
      this.getSchoolDetails();
    }, error => {
      this.utils.stopLoader();
      if (error.status == '401') {
        this.currentUser.removeUser();
        this.appCtrl.getRootNav().push(WelcomePage);
      }
    })
  }

  getSchoolDetails(): void {
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

  getLocalSchoolDetails(): void {
    console.log('School details')
    this.storage.get('schoolsDetails').then(details => {
      this.schoolDetails = JSON.parse(details);
      for (const schoolId of Object.keys(this.schoolDetails)) {
        console.log(schoolId);
        this.checkForProgressStatus(this.schoolDetails[schoolId]['assessments'][0]['evidences'])
      }
    })
  }

  goToSections(school, evidenceIndex) {
    // console.log(JSON.stringify(school));
    if (!this.schoolDetails[school._id.toString()]['assessments'][0]['evidences'][evidenceIndex].startTime) {
      this.schoolDetails[school._id.toString()]['assessments'][0]['evidences'][evidenceIndex].startTime = Date.now();
      this.utils.setLocalSchoolData(this.schoolDetails)
    }
    this.appCtrl.getRootNav().push('SectionListPage', { _id: school._id, name: school.name, selectedEvidence: evidenceIndex, parent: this });
    
    // this.navCtrl.push('SectionListPage', { _id: school._id, name: school.name, selectedEvidence: evidenceIndex })
  }

  gotToEvidenceList(school) {
    this.appCtrl.getRootNav().push('EvidenceListPage', { _id: school._id, name: school.name, parent: this})
  }

  goToProfile(school) : void {
    this.appCtrl.getRootNav().push('SchoolProfilePage', { _id: school._id, name: school.name, parent: this})
  }

  successCallback = (response) => {
    this.schoolDetails.push(response.result);
    if (this.schoolDetails.length === this.schoolList.length) {
      this.utils.stopLoader();
      const schoolDetailsObj = {}
      for (const school of this.schoolDetails) {
        console.log(school['schoolProfile']._id + ' 2nd');
        schoolDetailsObj[school['schoolProfile']._id] = school;
      }
      console.log(JSON.stringify(this.schoolDetails));
      this.storage.set('schoolsDetails', JSON.stringify(schoolDetailsObj));
      this.getLocalSchoolDetails()
    }
  }

  checkForProgressStatus(evidences) {
    console.log("yeee")
    for (const evidence of evidences) {
      console.log(evidence.startTime);
      if (evidence.isSubmitted) {
        evidence.progressStatus = 'submitted';
      } else if (!evidence.startTime) {
        evidence.progressStatus = '';
      } else {
        evidence.progressStatus = 'completed';
        for (const section of evidence.sections) {
          if (section.progressStatus === 'inProgress' || !section.progressStatus) {
            evidence.progressStatus = 'inProgress';
          }
        }
      }
    }
  }

  ionViewWillEnter() {
    this.onInit()   
  }

  onInit() {
    this.navCtrl.id = "HomePage";
    console.log('refresh');
    this.userData = this.currentUser.getCurrentUserData();
    this.storage.get('schools').then(schools => {
      console.log(JSON.stringify(schools))
      if (schools) {
        this.schoolList = schools;
        this.getLocalSchoolDetails();
      } else {
        this.getSchoolListApi();
      }
    }).catch(error => {
      this.getSchoolListApi();
    })
  }


}
