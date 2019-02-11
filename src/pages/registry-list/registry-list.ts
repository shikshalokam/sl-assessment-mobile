import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { RegistryFormPage } from '../registry-form/registry-form';
import { NetworkGpsProvider } from '../../providers/network-gps/network-gps';
import { UtilsProvider } from '../../providers/utils/utils';
import { ApiProvider } from '../../providers/api/api';
import { AppConfigs } from '../../providers/appConfig';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';

@IonicPage()
@Component({
  selector: 'page-registry-list',
  templateUrl: 'registry-list.html',
})
export class ParentsListPage {

  schoolId: string;
  schoolName: string;
  programId: string;
  schoolDetails: any;
  registryList: any;
  showUploadBtn: boolean;
  networkConnected: boolean;
  registryType: string;

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
    this.registryType = this.navParams.get('registry');
    // this.storage.get('parentRegisterForm').then(form => {
      // console.log(this.schoolId)
      this.utils.startLoader();
      this.localStorage.getLocalStorage('assessmentDetails_'+this.schoolId).then(schoolDetails => {
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
    // })

    this.storage.get(this.registryType+'Details_'+ this.schoolId).then(registryData => {
      if(registryData){
        this.utils.stopLoader();
        this.registryList = registryData ? registryData : [];
        this.showUploadBtn = this.checkForUploadBtn();
      } else {
        this.getRegistryList();
        this.getRegistryForm();
      }
    })

  }

  getRegistryList() {
    this.apiService.httpGet(AppConfigs.registry['get'+this.registryType+'List']+this.schoolId, success => {
      this.registryList = success.result ?  success.result : [];
      this.showUploadBtn = false;
      for (const item of success.result) {
        item.uploaded = true;
      }
      this.utils.stopLoader();
    }, error => {
      this.utils.stopLoader();
    })
  }

  getRegistryForm() {
    this.apiService.httpGet(AppConfigs.registry['get'+this.registryType+'RegisterForm'], success => {
      this.localStorage.setLocalStorage(this.registryType+'RegisterForm', success.result)
    }, error => {
    })
  }

  addRegistryItem(): void {
    const params = {
      _id: this.schoolId,
      name: this.schoolName,
      registryType: this.registryType
    }
    let registryForm = this.modalCntrl.create(RegistryFormPage, params);
    registryForm.onDidDismiss(data => {
      if (data) {
        data.programId = this.schoolDetails['program']._id;
        data.schoolId = this.schoolId;
        data.schoolName = this.schoolName;
        this.registryList.push(data);
        this.showUploadBtn = this.checkForUploadBtn();
        this.localStorage.setLocalStorage(this.registryType+'Details_'+this.schoolId, this.registryList)
        // this.storage.set('parentDetails', JSON.stringify(this.allSchoolParentList));
      }

    })
    registryForm.present();
  }

  updateAllParents() {
    const key = this.registryType === 'Leader' ? 'schoolLeaders': 'teachers'; 
    const obj = {
      [key]: []
    };
    for (const item of this.registryList) {
      console.log(JSON.stringify(item))
      if( item.uploaded === false) {
        delete item.uploaded;
        obj[key].push(item);
      }
    }
    if(this.networkConnected){
      this.utils.startLoader();
      this.apiService.httpPost(AppConfigs.registry['add'+this.registryType+'Info'], obj, success => {
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
    for (const item of this.registryList) {
      item.uploaded = true;
    }
    this.showUploadBtn = this.checkForUploadBtn();
    this.localStorage.setLocalStorage(this.registryType+'Details_'+this.schoolId, this.registryList)

    // this.storage.set('parentDetails', JSON.stringify(this.allSchoolParentList));
  }

  checkForUploadBtn() {
    if(this.registryList && this.registryList.length){
      for (const item of this.registryList) {
        if (!item.uploaded){
          return true
        }
      }
      return false
    }

  }

}
