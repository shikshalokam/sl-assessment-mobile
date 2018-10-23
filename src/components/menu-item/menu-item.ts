import { Component, Input } from '@angular/core';
import { NavParams, App, ViewController, Events } from 'ionic-angular';
import { RatingProvider } from '../../providers/rating/rating';
import { UtilsProvider } from '../../providers/utils/utils';
import { NetworkGpsProvider } from '../../providers/network-gps/network-gps';

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
    private events: Events, private ngps: NetworkGpsProvider) {
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

  close() {
    this.viewCtrl.dismiss();
  }
}
