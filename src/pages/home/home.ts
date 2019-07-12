import { Component } from '@angular/core';
import { NavController, Events, Platform } from 'ionic-angular';
import { CurrentUserProvider } from '../../providers/current-user/current-user';
import { SocialSharing } from '@ionic-native/social-sharing';
import { FileChooser } from '@ionic-native/file-chooser';
import { Base64 } from '@ionic-native/base64/ngx';

import { Network } from '@ionic-native/network';
import { InstitutionsEntityList } from '../institutions-entity-list/institutions-entity-list';
import { IndividualListingPage } from '../individual-listing/individual-listing';
import { ObservationsPage } from '../observations/observations';
import { File } from '@ionic-native/file';
import { SharingFeaturesProvider } from '../../providers/sharing-features/sharing-features';

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
  parentList: any = [];
  errorMsg: string;
  generalQuestions: any;
  schoolIndex = 0;
  currentProgramId: any;

  allPages: Array<Object> = [

    {
      name: "institutional",
      subName: 'assessments',
      icon: "book",
      component: InstitutionsEntityList,
      active: false
    },
    {
      name: "individual",
      subName: 'assessments',
      icon: "person",
      component: IndividualListingPage,
      active: false
    },
    {
      name: "observations",
      subName: '',
      icon: "eye",
      component: ObservationsPage,
      active: false
    },

  ]

  constructor(public navCtrl: NavController,
    private currentUser: CurrentUserProvider,
    private network: Network,
    private events: Events,
    private sharingFeature : SharingFeaturesProvider,
    private platform: Platform,
  ) {


    this.isIos = this.platform.is('ios') ? true : false;



  }

  ionViewDidLoad() {
    this.userData = this.currentUser.getCurrentUserData();
    this.navCtrl.id = "HomePage";

    if (this.network.type != 'none') {
      this.networkAvailable = true;
    }
  }

  socialSharingInApp() {
   this.sharingFeature.sharingThroughApp();
  }
  goToPage(index) {
    this.events.publish('navigateTab', this.allPages[index]['name'])
  }

  ionViewWillLeave() {

  }


}
