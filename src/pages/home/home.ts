import { Component } from '@angular/core';
import { NavController, Events, Platform } from 'ionic-angular';
import { CurrentUserProvider } from '../../providers/current-user/current-user';
import { Network } from '@ionic-native/network';
import { InstitutionsEntityList } from '../institutions-entity-list/institutions-entity-list';
import { IndividualListingPage } from '../individual-listing/individual-listing';
import { ObservationsPage } from '../observations/observations';
import { SharingFeaturesProvider } from '../../providers/sharing-features/sharing-features';
import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { ApiProvider } from '../../providers/api/api';
import { AppConfigs } from '../../providers/appConfig';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { UtilsProvider } from '../../providers/utils/utils';
import { RoleListingPage } from '../role-listing/role-listing';

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
  profileRoles;
  dashboardEnable: boolean;
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
  recording: boolean = false;
  filePath: string;
  fileName: string;
  audio: MediaObject;
  audioList: any[] = [];
  canViewLoad: boolean = false;
  pages;
  constructor(public navCtrl: NavController,
    private currentUser: CurrentUserProvider,
    private network: Network,
    private media: Media,
    private currentUserProvider: CurrentUserProvider,
    private localStorageProvider: LocalStorageProvider,
    private file: File,
    private events: Events,
    private sharingFeature: SharingFeaturesProvider,
    private platform: Platform,
    private apiService: ApiProvider,
    private localStorage: LocalStorageProvider,
    private apiProvider: ApiProvider,
    private utils: UtilsProvider
  ) {


    this.isIos = this.platform.is('ios') ? true : false;



  }

  ionViewDidLoad() {
    this.userData = this.currentUser.getCurrentUserData();
    this.navCtrl.id = "HomePage";
    this.localStorageProvider.getLocalStorage('profileRole').then(success => {
      this.profileRoles = success;
      if (success.roles.length > 0) {
        this.dashboardEnable = true;
        this.canViewLoad = true;
        this.pages = this.allPages;
        this.events.publish('multipleRole', true);
      } 

    }).catch(error => {
      this.getRoles();
    })
    if (this.network.type != 'none') {
      this.networkAvailable = true;
    }

    this.localStorage.getLocalStorage('staticLinks').then(success => {
      if (success) {
      } else {
        this.getStaticLinks();
      }
    }).catch(error => {
      this.getStaticLinks();
    })
  }

  getRoles() {
    // return new Promise((resolve, reject) => {
    let currentUser = this.currentUserProvider.getCurrentUserData();
    this.apiProvider.httpGet(AppConfigs.roles.getProfile + currentUser.sub, success => {
      this.profileRoles = success.result;
      this.localStorage.setLocalStorage('profileRole', this.profileRoles)
      if (success.result.roles.length > 0) {
        this.dashboardEnable = true;
        this.events.publish('multipleRole', true);
      }
    }, error => {
      this.utils.openToast(error);
    })
  }

  socialSharingInApp() {
    this.sharingFeature.sharingThroughApp();
  }

  getStaticLinks() {
    this.apiService.httpGet(AppConfigs.externalLinks.getStaticLinks, success => {
      this.localStorage.setLocalStorage('staticLinks', success.result);
    }, error => {
    });
  }

  goToPage(index) {
    this.events.publish('navigateTab', index >= 0 ? this.allPages[index]['name'] : 'dashboard')
  }

  ionViewWillLeave() {
    this.events.unsubscribe('multipleRole');
  }


}
