import { Component } from '@angular/core';
import { NavParams, App, ViewController, Events , ModalController} from 'ionic-angular';
import { RatingProvider } from '../../providers/rating/rating';
import { UtilsProvider } from '../../providers/utils/utils';
import { NetworkGpsProvider } from '../../providers/network-gps/network-gps';
import { RegistryFormPage } from '../../pages/registry-form/registry-form';
import { UpdateLocalSchoolDataProvider } from '../../providers/update-local-school-data/update-local-school-data';
import { FeedbackPage } from '../../pages/feedback/feedback';

@Component({
  selector: 'menu-item',
  templateUrl: 'menu-item.html'
})
export class MenuItemComponent {

  submissionId: any;
  schoolId: string;
  schoolName: string;
  parent: any;
  networkAvailable: boolean;
  subscription: any;
  programId: string;
  hideTeacherRegistry = true;
  hideLeaderRegistry=true;
  hideFeedback= true;
  entityId: any;
  showMenuArray: any;

  constructor(private navParams: NavParams, private ratingService: RatingProvider,
    private appCtrl: App, private viewCtrl: ViewController, private utils: UtilsProvider,
    private events: Events, private ngps: NetworkGpsProvider, private modalCntrl: ModalController,
    private usld: UpdateLocalSchoolDataProvider) {
    console.log('Hello MenuItemComponent Component');
    this.showMenuArray =  this.navParams.get('showMenuArray');
    console.log(JSON.stringify(this.showMenuArray) + "REGISTERY ARRAY");

    // this.showMenuItems(this.navParams.get('showMenuArray'));
    this.submissionId = this.navParams.get('submissionId');
    this.entityId = this.navParams.get('entityId') ? this.navParams.get('entityId') : null;
    this.schoolId = this.navParams.get('_id');
    this.schoolName = this.navParams.get('name');
   
    // this.parent = this.navParams.get("parent");
    // console.log(this.hideFeedback + "hide feedback");

    this.programId = this.navParams.get("programId")
    this.subscription = this.events.subscribe('network:offline', () => {
      this.utils.openToast("Network disconnected");
      this.networkAvailable = false;
    });

    // Online event
    const onine = this.events.subscribe('network:online', () => {
      this.utils.openToast("Network connected");
      this.networkAvailable = true;
    });

    this.networkAvailable = this.ngps.getNetworkStatus();
  }

  goToFlaggin(): void {
    const school = {
      _id: this.schoolId,
      name: this.schoolName
    }
    // const submissionId = this.schoolDetails[school._id]['assessments'][0].submissionId;
    if (!this.networkAvailable) {
      this.utils.openToast("Please enable your internet connection to continue.", "Ok");
    } else {
      this.ratingService.fetchRatedQuestions(this.submissionId, school);
    }
    this.close();
  }

  goToRating(): void {
    const school = {
      _id: this.schoolId,
      name: this.schoolName
    }
    if (!this.networkAvailable) {
      this.utils.openToast("Please enable your internet connection to continue.", "Ok");
    } else {
      this.ratingService.checkForRatingDetails(this.submissionId, school);
    }
    this.close();
  }

  goToProfile(): void {
    this.appCtrl.getRootNav().push('EntityProfilePage', {
      _id: this.submissionId,
      name: this.schoolName,
      // parent: this.parent
    })
    this.close();
  }

  goToRegistry(registryType): void {
    this.appCtrl.getRootNav().push('ParentsListPage', {
      _id: this.schoolId,
      name: this.schoolName,
      registry: registryType,
      submissionId:this.submissionId,
      entityId:this.entityId

    })
    this.close();
  }

  close() {
    this.viewCtrl.dismiss();
  }

  refreshSchoolData(): void {
    const schoolData = {
      _id: this.schoolId,
      name: this.schoolName,
    };
    this.usld.getLocalData(schoolData);
    this.close();
  }

  addParent(): void {
    const params = {
      _id: this.schoolId,
      name: this.schoolName,
    }
    let parentForm = this.modalCntrl.create(RegistryFormPage, params);
    // parentForm.onDidDismiss(data => {
    //   if (data) {
    //     data.programId = this.schoolDetails['program']._id;
    //     data.schoolId = this.schoolId;
    //     data.schoolName = this.schoolName;
    //     this.parentInfoList.push(data)
    //     this.storage.set('ParentInfo', this.parentInfoList);
    //   }

    // })
    parentForm.present();
    this.close();
  }

  feedback(): void {
    const params = {
      schoolId: this.schoolId,
      schoolName: this.schoolName,
      programId: this.programId,
      submissionId: this.submissionId
    }
    let feedbackModal = this.modalCntrl.create(FeedbackPage, params);
    feedbackModal.present();
    this.close();

  }


  // showMenuItems(showMenuitemsArray ){
  //   console.log(JSON.stringify(showMenuitemsArray))
  //   // this.hideTeacherRegistry = this.navParams.get('hideTeacherRegistry') === null  ||this.navParams.get('hideTeacherRegistry') === undefined ? true : this.navParams.get('hideTeacherRegistry')  ;
  //   // this.hideLeaderRegistry=this.navParams.get('hideLeaderRegistry') === null || this.navParams.get('hideLeaderRegistry') === undefined  ?  true : this.navParams.get('hideLeaderRegistry');
  //   // this.hideFeedback= this.navParams.get('hideFeedback') === null ||this.navParams.get('hideFeedback') === undefined  ?  true : this.navParams.get('hideFeedback') ;
  //   this.hideTeacherRegistry = showMenuitemsArray.indexOf("teacher") >= 0 ? true :false;
  //   this.hideLeaderRegistry = showMenuitemsArray.indexOf("shcoolLeader") >= 0 ? true :false;
  //   this.hideFeedback = showMenuitemsArray.indexOf("feedback") >= 0 ? true :false;
  // }
}
