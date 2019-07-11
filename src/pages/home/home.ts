import { Component } from '@angular/core';
import { NavController, Events, Platform } from 'ionic-angular';
import { CurrentUserProvider } from '../../providers/current-user/current-user';
import { SocialSharing } from '@ionic-native/social-sharing';
import { FileChooser } from '@ionic-native/file-chooser';

import { Network } from '@ionic-native/network';
import { InstitutionsEntityList } from '../institutions-entity-list/institutions-entity-list';
import { IndividualListingPage } from '../individual-listing/individual-listing';
import { ObservationsPage } from '../observations/observations';

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
    private socialSharing: SocialSharing,
    private currentUser: CurrentUserProvider,
    private network: Network,
    private events: Events,
    private platform: Platform,
    private fileChooser: FileChooser
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

  shareViaEmail() {
    console.log("file choosed")

    
    this.fileChooser.open()
      .then(uri => {
        console.log(JSON.stringify(uri))
       let file = uri
        let subject = "hi";
    let link = "google.com";
    let message = "hi";
        if (uri){
          this.socialSharing.share(message, subject, uri, link).then(() => {
            console.log("share Success")
          }).catch(() => {
            console.log("share Failure")
  
          });
        }
       
      }
      )
      .catch(e => console.log(e));


    // this.socialSharing.canShareViaEmail().then(() => {


  }
  goToPage(index) {
    this.events.publish('navigateTab', this.allPages[index]['name'])
  }

  ionViewWillLeave() {

  }


}
