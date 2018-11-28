import { Component } from '@angular/core';
import { NavController, App, Events, Platform } from 'ionic-angular';
import { CurrentUserProvider } from '../../providers/current-user/current-user';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';
import { UtilsProvider } from '../../providers/utils/utils';
import { SchoolConfig } from '../../providers/school-list/schoolConfig';
import { WelcomePage } from '../welcome/welcome';
import { RatingProvider } from '../../providers/rating/rating';
import { PopoverController } from 'ionic-angular';
import { MenuItemComponent } from '../../components/menu-item/menu-item';
import { Network } from '@ionic-native/network';
import { NetworkGpsProvider } from '../../providers/network-gps/network-gps';
import { EvidenceProvider } from '../../providers/evidence/evidence';
import { AppConfigs } from '../../providers/appConfig';
import { UpdateLocalSchoolDataProvider } from '../../providers/update-local-school-data/update-local-school-data';

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
  subscription: any;
  networkAvailable: boolean;
  isIos: boolean = this.platform.is('ios');
  parentList: any =[];

  constructor(public navCtrl: NavController,
    private currentUser: CurrentUserProvider,
    private apiService: ApiProvider,
    private utils: UtilsProvider, private appCtrl: App,
    private storage: Storage,
    private ratingService: RatingProvider,
    private popoverCtrl: PopoverController,
    private network: Network,
    private events: Events,
    private ngps: NetworkGpsProvider,
    private evdnsServ: EvidenceProvider,
    private platform: Platform,
    private ulsd: UpdateLocalSchoolDataProvider
  ) {
    this.subscription = this.events.subscribe('localDataUpdated', () => {
      console.log("Updated")
      this.getLocalSchoolDetails();
    });

    // Online event
    // constthis.events.subscribe('localDataUpdated', () => {
    // });
    // this.networkAvailable = this.ngps.getNetworkStatus()
  }

  getSchoolListApi(): void {
    this.utils.startLoader();
    this.apiService.httpGet(SchoolConfig.getSchoolsOfAssessors, response => {
      this.schoolList = response.result;
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
    for (const school of this.schoolList) {
      // console.log(school['_id']);
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

  openAction(school, evidenceIndex) {
    this.utils.setCurrentimageFolderName(this.schoolDetails[school._id.toString()]['assessments'][0]['evidences'][evidenceIndex].externalId, school._id)
    const options = { _id: school._id, name: school.name, selectedEvidence: evidenceIndex, schoolDetails: this.schoolDetails, parent: this };
    this.evdnsServ.openActionSheet(options);
  }



  goToRating(school): void {
    const submissionId = this.schoolDetails[school._id]['assessments'][0].submissionId;
    this.ratingService.checkForRatingDetails(submissionId, school);
  }

  getParentRegistryForm() : void {
    this.apiService.httpGet(AppConfigs.parentInfo.getParentRegisterForm, success => {
      this.storage.set('parentRegisterForm', JSON.stringify(success.result));
    }, error => {

    })
  }

  getLocalSchoolDetails(): void {
    this.storage.get('schoolsDetails').then(details => {
      this.schoolDetails = JSON.parse(details);
      for (const schoolId of Object.keys(this.schoolDetails)) {
        this.checkForProgressStatus(this.schoolDetails[schoolId]['assessments'][0]['evidences'])
      }
    })
  }

  goToSections(school, evidenceIndex) {
    if (this.schoolDetails[school._id.toString()]['assessments'][0]['evidences'][evidenceIndex].startTime) {
      this.utils.setCurrentimageFolderName(this.schoolDetails[school._id.toString()]['assessments'][0]['evidences'][evidenceIndex].externalId, school._id)
      this.appCtrl.getRootNav().push('SectionListPage', { _id: school._id, name: school.name, selectedEvidence: evidenceIndex, parent: this })
    } else {
      this.openAction(school, evidenceIndex);
    }
  }

  gotToEvidenceList(school) {
    this.appCtrl.getRootNav().push('EvidenceListPage', { _id: school._id, name: school.name, parent: this })
  }

  goToProfile(school): void {
    this.appCtrl.getRootNav().push('SchoolProfilePage', { _id: school._id, name: school.name, parent: this })
  }

  successCallback = (response) => {
    // console.log(JSON.stringify(response))
    this.schoolDetails.push(response.result);
    if (this.schoolDetails.length === this.schoolList.length) {
      // this.utils.stopLoader();
      const schoolDetailsObj = {}
      for (const school of this.schoolDetails) {
        // console.log(school['schoolProfile']._id + ' 2nd');
        schoolDetailsObj[school['schoolProfile']._id] = school;
      }
      // console.log("Local school data"+JSON.stringify(schoolDetailsObj));
      this.storage.set('schoolsDetails', JSON.stringify(schoolDetailsObj));
      // this.getLocalSchoolDetails();
      this.mappSubmissionData(schoolDetailsObj);
      this.getParentRegistry();
    }
  }

  getParentRegistry() {
    for (const school of this.schoolList) {
      // console.log(school['_id']);
      this.apiService.httpGet(AppConfigs.parentInfo.getParentList + school['_id'], this.parentListSuccessCallback, error => {

      })
    }
  }

  parentListSuccessCallback = (data) => {
    this.parentList.push(data.result);
    if(this.parentList.length === this.schoolList.length) {
    // console.log(JSON.stringify(this.parentList))

      const parentDetailsObj = {};
      this.utils.stopLoader();
      for (const parentdata of this.parentList) {
        const schoolId = parentdata.length ? parentdata[0]['schoolId'] : null;
        if(schoolId) {
          for (const parent of parentdata) {
            if(parent && parent.uploaded){
              parent.uploaded = true;
            }
          }
          parentDetailsObj[schoolId] = parentdata;
        }
      }
      this.storage.set('parentDetails', JSON.stringify(parentDetailsObj));
      console.log(JSON.stringify(parentDetailsObj))

    }
  }


  mappSubmissionData(schoolDetailsObj) : void {
    for (const school of this.schoolList ) {
      const obj = {
        _id: school['_id'],
      }
      // console.log("School details " +JSON.stringify(schoolDetailsObj[school['_id']]))
      if(schoolDetailsObj[school['_id']].assessments[0].submissions) {
      // console.log(JSON.stringify(schoolDetailsObj[school['_id']].assessments[0].submissions));

        this.ulsd.getLocalData(obj, schoolDetailsObj[school['_id']].assessments[0].submissions)
      }
      // schoolDetailsObj[key];
      // this.u

      // console.log(JSON.stringify(school));
    }
    this.getLocalSchoolDetails();

  }

  checkForProgressStatus(evidences) {
    console.log("yeee")
    for (const evidence of evidences) {
      console.log(evidence.startTime);
      if (evidence.isSubmitted) {
        evidence.progressStatus = 'submitted';
      } else if (!evidence.startTime) {
        console.log(evidence.startTime)
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
    console.log("Inside view will enetr");
    this.onInit();
    if (this.network.type != 'none') {
      this.networkAvailable = true;
    }
  }

  onInit() {
    this.navCtrl.id = "HomePage";
    console.log('refresh');
    this.storage.get('parentRegisterForm').then(form => {
      if(!form){
        this.getParentRegistryForm();
      }
    })
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

  getRatedQuestions(school): void {
    const submissionId = this.schoolDetails[school._id]['assessments'][0].submissionId;
    this.ratingService.fetchRatedQuestions(submissionId, school);
  }

  openMenu(myEvent, school) {
    let popover = this.popoverCtrl.create(MenuItemComponent, {
      submissionId: this.schoolDetails[school._id]['assessments'][0].submissionId,
      _id: school._id,
      name: school.name,
      parent: this,
      programId:this.schoolDetails[school._id].program._id
    });
    popover.present({
      ev: myEvent
    });
  }

  ionViewWillLeave() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


}
