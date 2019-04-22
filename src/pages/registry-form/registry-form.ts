import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsProvider } from '../../providers/utils/utils';
import { ApiProvider } from '../../providers/api/api';
import { AppConfigs } from '../../providers/appConfig';
import { NetworkGpsProvider } from '../../providers/network-gps/network-gps';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';

@Component({
  selector: 'page-registry-form',
  templateUrl: 'registry-form.html',
})
export class RegistryFormPage {

  formFields: any = [];
  form: FormGroup;
  schoolDetails: any;
  schoolId: any;
  schoolName: any;
  programId: string;
  networkConnected: boolean;
  registryType: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private viewCntrl: ViewController, private ngps: NetworkGpsProvider,
    private events: Events, private localStorage: LocalStorageProvider,
    private utils: UtilsProvider, private apiService: ApiProvider) {
    this.schoolId = this.navParams.get('_id');
    this.schoolName = this.navParams.get('name');
    this.registryType = this.navParams.get('registryType');
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
    console.log('ionViewDidLoad ParentsFormPage');
    this.localStorage.getLocalStorage(this.registryType + 'RegisterForm').then(formFields => {
      if (formFields) {
        for (const formField of formFields) {
          if (formField.visible) {
            this.formFields.push(formField)
          }
        }
        this.form = this.createFormGroup();
      }
    }).catch(error => {
    })

    this.localStorage.getLocalStorage(this.utils.getAssessmentLocalStorageKey(this.schoolId)).then(schoolDetails => {
      if (schoolDetails) {
        this.schoolDetails = schoolDetails;
        this.programId = this.schoolDetails['program']._id;
      }
    }).catch(error => {
    })
  }

  createFormGroup(): any {
    let formGrp = {};
    this.formFields.forEach(formfield => {
      formGrp[formfield.field] = formfield.validation.required ? new FormControl(formfield.value || "", Validators.required) : new FormControl(formfield.value || "");
    });
    return new FormGroup(formGrp)
  }

  update(): void {
    const key = this.registryType === 'Leader' ? 'schoolLeaders' : 'teachers';
    const payload = { [key]: [] }
    const obj = this.form.value;
    obj.programId = this.schoolDetails['program']._id;
    obj.schoolId = this.schoolId;
    obj.schoolName = this.schoolName;
    payload[key].push(obj)
    if (this.networkConnected) {
      this.utils.startLoader();
      this.apiService.httpPost(AppConfigs.registry['add' + this.registryType + 'Info'], payload, success => {
        this.utils.stopLoader();
        this.utils.openToast(success.message);
        obj.uploaded = true;
        this.viewCntrl.dismiss(obj);
      }, error => {
        this.utils.openToast("Something went wrong. Please try again after sometime.", "Ok");
        this.utils.stopLoader();
        obj.uploaded = false;
        this.viewCntrl.dismiss(obj)
      })
    } else {
      obj.uploaded = false;
      this.viewCntrl.dismiss(obj)
    }
  }

  cancel(): void {
    this.viewCntrl.dismiss();
  }

}
