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
import { RoleDashboardPage } from '../role-dashboard/role-dashboard';
import * as HighCharts from 'highcharts';

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
  profileRoles ;
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
  constructor(public navCtrl: NavController,
    private currentUser: CurrentUserProvider,
    private network: Network,
    private media: Media,
    private currentUserProvider : CurrentUserProvider,
    private localStorageProvider : LocalStorageProvider,
    private file: File,
    private events: Events,
    private sharingFeature: SharingFeaturesProvider,
    private platform: Platform,
    private apiService: ApiProvider,
    private localStorage:LocalStorageProvider,
    private apiProvider : ApiProvider,
    private utils : UtilsProvider
  ) {


    this.isIos = this.platform.is('ios') ? true : false;



  }

  ionViewDidLoad() {
    this.userData = this.currentUser.getCurrentUserData();
    this.navCtrl.id = "HomePage";
    this.localStorageProvider.getLocalStorage('profileRole').then( success => {
      this.profileRoles = success;
      console.log(JSON.stringify(success))
      // this.getRoles();
     if( success.result.roles.length > 0 ){
       this.allPages.push({
        name: "dashboard",
        subName: '',
        icon: "analytics",
        component: RoleDashboardPage,
        active: false
    }) 
    this.events.publish('multipleRole' , true);
  }

    }).catch( error =>{
      this.getRoles();
      console.log("called get roles")
    })
    if (this.network.type != 'none') {
      this.networkAvailable = true;
    }

    this.localStorage.getLocalStorage('staticLinks').then(success => {
      if(success){

      } else{
        this.getStaticLinks();
      }
    }).catch(error => {
      this.getStaticLinks();
    })


    // ionViewDidLoad() { 
     
    // }
  }
// expansionData={
//   title :"hi"
// }
  getRoles() {
   console.log("i m here")
    let currentUser =   this.currentUserProvider.getCurrentUserData();
   console.log(JSON.stringify(currentUser) + "usr details")
    this.apiProvider.httpGet(AppConfigs.roles.getProfile+currentUser.sub,success =>{
      this.profileRoles = success.result;
      console.log(JSON.stringify(success))
      success.result.roles.length > 0 ? this.allPages.push({
          name: "dashoard",
          subName: '',
          icon: "analytics",
          component: RoleDashboardPage,
          active: false
      }) : null;
      this.events.publish('multipleRole' , true);
      this.localStorageProvider.setLocalStorage('profileRole',success);
    },error =>{
      this.utils.openToast(error);
    })  
    console.log("func end");
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

  // getAudioList() {
  //   if(localStorage.getItem("audiolist")) {
  //     this.audioList = JSON.parse(localStorage.getItem("audiolist"));
  //     console.log(this.audioList);
  //   }
  // }


  // startRecord() {
  //   if (this.platform.is('ios')) {
  //     this.fileName = 'record'+new Date().getDate()+new Date().getMonth()+new Date().getFullYear()+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+'.3gp';
  //     this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + this.fileName;

  //     this.audio = this.media.create(this.filePath);
  //   } else if (this.platform.is('android')) {
  //     this.fileName = 'record'+new Date().getDate()+new Date().getMonth()+new Date().getFullYear()+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+'.3gp';
  //     this.filePath = 'file:///'+this.file.externalDataDirectory.replace(/file:\/\//g, '') + this.fileName;
  //     console.log(this.filePath)
  //     this.audio = this.media.create(this.filePath);
  //   }
  //   this.audio.startRecord();
  //   this.recording = true;
  // }

  // stopRecord() {
  //   this.audio.stopRecord();
  //   let data = { filename: this.fileName };
  //   this.audioList.push(data);
  //   localStorage.setItem("audiolist", JSON.stringify(this.audioList));
  //   this.recording = false;
  //   this.getAudioList();
  // }


  // playAudio(file,idx) {
  //   console.log(file)
  //   if (this.platform.is('ios')) {
  //     this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + file;
  //     this.audio = this.media.create(this.filePath);
  //   } else if (this.platform.is('android')) {
  //     this.filePath = 'file:///'+this.file.externalDataDirectory.replace(/file:\/\//g, '') + file;
  //     console.log(this.filePath)
  //     this.audio = this.media.create(this.filePath);
  //     console.log("audio")
  //   }
  //   this.audio.play();
  //   this.audio.setVolume(1);
  // }

  goToPage(index) {
    this.events.publish('navigateTab', this.allPages[index]['name'])
  }

  ionViewWillLeave() {

  }


}
