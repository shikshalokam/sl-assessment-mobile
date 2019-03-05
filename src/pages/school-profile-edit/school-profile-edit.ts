import { Component } from '@angular/core';
import { NavController, NavParams, App , Events} from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { UtilsProvider } from '../../providers/utils/utils';
import { Storage } from '@ionic/storage';
import { AppConfigs } from '../../providers/appConfig';
import { NetworkGpsProvider } from '../../providers/network-gps/network-gps';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';


@Component({
  selector: 'page-school-profile-edit',
  templateUrl: 'school-profile-edit.html',
})
export class SchoolProfileEditPage {

  schoolProfile: Array<string>;
  schoolId: any;
  schoolName: string;
  schoolData: any;
  networkConnected: boolean;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private apiService: ApiProvider,
    private utils: UtilsProvider,
    private storage: Storage,
    private app: App,
    private ngps: NetworkGpsProvider,
    private events: Events, 
    private localStorage: LocalStorageProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SchoolProfilePage');
    this.getSchoolDetails();
    this.schoolId = this.navParams.get('_id');
    this.schoolName = this.navParams.get('name');
    console.log(this.navParams.get('_id'));
    this.localStorage.getLocalStorage(this.utils.getAssessmentLocalStorageKey(this.schoolId)).then(data => {
      this.schoolData = data;
      this.schoolProfile = this.schoolData['schoolProfile']['form'];
      this.events.subscribe('network:offline', () => {
        this.networkConnected = false;
      });
  
      // Online event
      this.events.subscribe('network:online', () => {
        this.networkConnected = true;
      });
      this.networkConnected = this.ngps.getNetworkStatus()
    }).catch(error => {

    })
    // this.storage.get('schoolsDetails').then(data => {
    //   this.schoolData = JSON.parse(data);
    //   this.schoolProfile = this.schoolData[this.schoolId]['schoolProfile']['form'];
    //   console.log(JSON.stringify(this.schoolProfile));

      // this.events.subscribe('network:offline', () => {
      //   this.networkConnected = false;
      // });
  
      // // Online event
      // this.events.subscribe('network:online', () => {
      //   this.networkConnected = true;
      // });
      // this.networkConnected = this.ngps.getNetworkStatus()

    // }).catch(error => {

    // })

  }

  // createFormGroup() {
  //   let fg  = {};
  //   this.schoolProfile.forEach(formField => {
  //     fg[formField['field']] = 
  //   })
  // }

  getSchoolDetails() {
    // this.utils.startLoader();
    // this.apiService.httpGet(schoolProfileConfig.getSchoolDetails, response => {
    //   console.log(JSON.stringify(response));
    //   this.schoolProfile = response.result.schoolProfile.formFields;
    //   this.utils.stopLoader();
    // }, error => {
    //   this.utils.stopLoader();
    // })
  }

  goToPage(): void {
    this.app.getRootNav().push('EvidenceListPage', { _id: this.schoolId, name: this.schoolName })
  }

  updateProfile(): void {
    if(this.networkConnected) {
      this.utils.startLoader();
      const payload = {
        'schoolProfile': {},
      }
      for (const field of this.schoolProfile) {
        payload.schoolProfile[field['field']] = field['value'];
      }
      console.log(JSON.stringify(payload));
      const submissionId = this.schoolData['assessments'][0].submissionId;
      const url = AppConfigs.survey.submission + submissionId;
      this.apiService.httpPost(url, payload, response => {
        console.log(JSON.stringify(response));
        this.utils.openToast(response.message);
        this.localStorage.setLocalStorage(this.utils.getAssessmentLocalStorageKey(this.schoolId), this.schoolData)
        this.utils.stopLoader();
         this.navCtrl.pop();
      }, error => {
        this.utils.stopLoader();
      })
    } else {
      this.utils.openToast("Please connect to network.")
    }

  }

  saveProfile() : void {
    this.localStorage.setLocalStorage(this.utils.getAssessmentLocalStorageKey(this.schoolId), this.schoolData)
    // this.utils.setLocalSchoolData(this.schoolData);
    this.navCtrl.pop();

  }


}
