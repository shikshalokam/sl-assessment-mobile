import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App , ModalController} from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { UtilsProvider } from '../../providers/utils/utils';
import { Storage } from '@ionic/storage';
import { EntityProfileEditPage } from '../entity-profile-edit/entity-profile-edit';
import { RatingProvider } from '../../providers/rating/rating';
import { AppConfigs } from '../../providers/appConfig';
import { RegistryFormPage } from '../registry-form/registry-form';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';

@IonicPage()
@Component({
  selector: 'page-entity-profile',
  templateUrl: 'entity-profile.html',
})
export class EntityProfilePage {

  schoolProfile: Array<string>;
  schoolId: any;
  schoolName: string;
  isEditable: boolean;
  submissionId: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private apiService: ApiProvider,
    private utils: UtilsProvider,
    private storage: Storage,
    private ratingService: RatingProvider,
    private app: App,
    private modalCntrl: ModalController,
    private localStorage: LocalStorageProvider) {
  }

  ionViewWillEnter() {
    console.log('ionViewDidLoad EntityProfilePage');
    this.schoolId = this.navParams.get('_id');
    this.schoolName = this.navParams.get('name');
    this.utils.startLoader()
    console.log(this.navParams.get('_id'));
    this.localStorage.getLocalStorage(this.utils.getAssessmentLocalStorageKey(this.schoolId)).then( data => {
      const schoolData = data;
      this.schoolProfile = schoolData['schoolProfile']['form'];
      this.submissionId = schoolData['assessments'][0].submissionId;
      this.isEditable = schoolData['schoolProfile']['isEditable'];
      this.utils.stopLoader();
    }).catch(error => {
      this.utils.stopLoader();      
    })
    // this.storage.get('schoolsDetails').then(data => {
    //   const schoolData = JSON.parse(data);
    //   this.schoolProfile = schoolData[this.schoolId]['schoolProfile']['form'];
    //   this.submissionId = schoolData[this.schoolId]['assessments'][0].submissionId;
    //   this.isEditable = schoolData[this.schoolId]['schoolProfile']['isEditable'];
    //   this.utils.stopLoader();
    // }).catch(error => {

    // })

  }

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

  goToEditProfile(): void {
    this.app.getRootNav().push(EntityProfileEditPage, { _id: this.schoolId, name: this.schoolName })

    // this.navCtrl.push('EntityProfilePage', { _id: this.schoolList[index]['_id'], name: this.schoolList[index]['name']})
  }

  goToRating() {
    const school = {
      _id: this.schoolId,
      name: this.schoolName
    }
    this.ratingService.checkForRatingDetails(this.submissionId, school);
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
  }

  getParentRegistryForm() : void {
    this.apiService.httpGet(AppConfigs.parentInfo.getParentRegisterForm, success => {
      this.storage.set('parentRegisterForm', JSON.stringify(success.result));
    }, error => {

    })
  }

  goToParentList() {
    this.navCtrl.push('ParentsListPage', { _id: this.schoolId, name: this.schoolName })
  }

  
}
