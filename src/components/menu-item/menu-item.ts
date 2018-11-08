import { Component, Input } from '@angular/core';
import { NavParams, App, ViewController, Events , ModalController} from 'ionic-angular';
import { RatingProvider } from '../../providers/rating/rating';
import { UtilsProvider } from '../../providers/utils/utils';
import { NetworkGpsProvider } from '../../providers/network-gps/network-gps';
import { ParentsFormPage } from '../../pages/parents-form/parents-form';

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

  constructor(private navParams: NavParams, private ratingService: RatingProvider,
    private appCtrl: App, private viewCtrl: ViewController, private utils: UtilsProvider,
    private events: Events, private ngps: NetworkGpsProvider, private modalCntrl: ModalController) {
    console.log('Hello MenuItemComponent Component');
    console.log(this.navParams.get("value"))
    this.submissionId = this.navParams.get('submissionId');
    this.schoolId = this.navParams.get('_id');
    this.schoolName = this.navParams.get('name');
    this.parent = this.navParams.get("parent");
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
    this.appCtrl.getRootNav().push('SchoolProfilePage', {
      _id: this.schoolId,
      name: this.schoolName,
      parent: this.parent
    })
    this.close();
  }

  goToParentRegistry(): void {
    console.log(this.schoolId);
    console.log(this.schoolName)

    this.appCtrl.getRootNav().push('ParentsListPage', {
      _id: this.schoolId,
      name: this.schoolName,
    })
    this.close();
  }

  close() {
    this.viewCtrl.dismiss();
  }

  addParent(): void {
    const params = {
      _id: this.schoolId,
      name: this.schoolName,
    }
    let parentForm = this.modalCntrl.create(ParentsFormPage, params);
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
}
