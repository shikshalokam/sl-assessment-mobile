import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ParentsFormPage } from '../parents-form/parents-form';
import { NetworkGpsProvider } from '../../providers/network-gps/network-gps';
import { UtilsProvider } from '../../providers/utils/utils';
import { ApiProvider } from '../../providers/api/api';
import { AppConfigs } from '../../providers/appConfig';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';

@IonicPage()
@Component({
  selector: 'page-parents-list',
  templateUrl: 'parents-list.html',
})
export class ParentsListPage {

  parentDetails: any;
  schoolId: string;
  schoolName: string;
  programId: string;
  schoolDetails: any;
  parentInfoList: any;
  allSchoolParentList: any;
  showUploadBtn: boolean;
  networkConnected: boolean;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private modalCntrl: ModalController, 
    private ngps: NetworkGpsProvider,
    private utils: UtilsProvider,
    private localStorage: LocalStorageProvider,
    private apiService: ApiProvider,
   private events: Events,) {
      this.events.subscribe('network:offline', () => {
        this.networkConnected = false;
      });
  
      // Online event
      this.events.subscribe('network:online', () => {
        this.networkConnected = true;
      });
      this.networkConnected = this.ngps.getNetworkStatus()
  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad ParentsListPage');
    this.schoolId = this.navParams.get('_id');
    this.schoolName = this.navParams.get('name');
    this.storage.get('parentRegisterForm').then(form => {
      // console.log(this.schoolId)
      this.localStorage.getLocalStorage('schoolDetails_'+this.schoolId).then(schoolDetails => {
        if (schoolDetails) {
          this.schoolDetails = schoolDetails;
          this.showUploadBtn = this.checkForUploadBtn();
        }
      }).catch(error => {

      })
      // this.storage.get('schoolsDetails').then(schoolDetails => {
      //   if (schoolDetails) {
      //     this.schoolDetails = JSON.parse(schoolDetails)[this.schoolId];
      //     this.showUploadBtn = this.checkForUploadBtn();
      //     // console.log(JSON.stringify(schoolDet[this.schoolId]['schoolProfile']))
      //     // this.programId = schoolDet[this.schoolId]['program'];

      //   }
      //   // this.programId = schoolDet[this.schoolId].program._id;
      //   // console.log(JSON.stringify(schoolDet[this.schoolId]['program']))
      // })
    })

    this.storage.get('parentDetails_'+ this.schoolId).then(parentData => {
      this.allSchoolParentList = parentData;
      if(parentData){
        this.parentInfoList = this.allSchoolParentList ? this.allSchoolParentList : [];
        this.showUploadBtn = this.checkForUploadBtn();
      } else {
        this.parentInfoList = [];
        this.showUploadBtn = false;

      }
    })

  }

  addParent(): void {
    const params = {
      _id: this.schoolId,
      name: this.schoolName,
    }
    let parentForm = this.modalCntrl.create(ParentsFormPage, params);
    parentForm.onDidDismiss(data => {
      if (data) {
        data.programId = this.schoolDetails['program']._id;
        data.schoolId = this.schoolId;
        data.schoolName = this.schoolName;
        this.parentInfoList.push(data);
        this.showUploadBtn = this.checkForUploadBtn();
        this.localStorage.setLocalStorage('parentDetails_'+this.schoolId, this.allSchoolParentList)
        // this.storage.set('parentDetails', JSON.stringify(this.allSchoolParentList));
      }

    })
    parentForm.present();
  }

  updateAllParents() {
    const obj = {
      parents: []
    };
    for (const parent of this.parentInfoList) {
      if(!parent.uploaded) {
        delete parent.uploaded;
        obj.parents.push(parent);
      }
    }
    if(this.networkConnected){
      this.utils.startLoader();
      this.apiService.httpPost(AppConfigs.parentInfo.addParentsInfo, obj, success => {
        this.utils.stopLoader();
        this.utils.openToast(success.message);
        this.makeAllAsUploaded();
      }, error => {
        this.utils.stopLoader();
        this.utils.openToast(error.message);

      })
    } else {
      this.utils.openToast("You need network connection for this action.");
    }
  }

  makeAllAsUploaded():void {
    for (const parent of this.parentInfoList) {
      parent.uploaded = true;
    }
    this.showUploadBtn = this.checkForUploadBtn();
    this.localStorage.setLocalStorage('parentDetails_'+this.schoolId, this.allSchoolParentList)

    // this.storage.set('parentDetails', JSON.stringify(this.allSchoolParentList));
  }

  checkForUploadBtn() {
    if(this.parentInfoList && this.parentInfoList.length){
      for (const parent of this.parentInfoList) {
        if (!parent.uploaded){
          return true
        }
      }
      return false
    }

  }

}
