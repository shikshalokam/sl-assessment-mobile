import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { Storage } from "@ionic/storage"
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsProvider } from '../../providers/utils/utils';
import { ApiProvider } from '../../providers/api/api';
import { AppConfigs } from '../../providers/appConfig';
import { NetworkGpsProvider } from '../../providers/network-gps/network-gps';

@Component({
  selector: 'page-parents-form',
  templateUrl: 'parents-form.html',
})
export class ParentsFormPage {

  formFields: any = [];
  form: FormGroup;
  schoolDetails: any;
  schoolId: any;
  schoolName: any;
  programId: string;
  parentInfoList: any;
  networkConnected: boolean;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private viewCntrl: ViewController, private ngps: NetworkGpsProvider,
    private storage: Storage, private events: Events,
    private utils: UtilsProvider, private apiService: ApiProvider) {
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
    this.storage.get("parentRegisterForm").then(formFields => {
      if (formFields) {
        for (const formField of JSON.parse(formFields)) {
          if (formField.visible) {
            this.formFields.push(formField)
          }
        }
        this.form = this.createFormGroup();
      }
    })
    this.storage.get('schoolsDetails').then(schoolDetails => {
      if (schoolDetails) {
        this.schoolId = this.navParams.get('_id');
        this.schoolName = this.navParams.get('name');
        this.schoolDetails = JSON.parse(schoolDetails)[this.schoolId];
        this.programId = this.schoolDetails['program']._id;
      }
    })

    this.storage.get('ParentInfo').then(success => {
      if (success) {
        this.parentInfoList = success;
      } else {
        this.parentInfoList = [];
      }
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
    const payload = { "parents": [] }
    const obj = this.form.value;
    obj.programId = this.schoolDetails['program']._id;
    obj.schoolId = this.schoolId;
    obj.schoolName = this.schoolName;
    payload.parents.push(obj)
    if (this.networkConnected) {
      this.utils.startLoader();
      this.apiService.httpPost(AppConfigs.parentInfo.addParentsInfo, payload, success => {
        this.utils.stopLoader();
        this.utils.openToast(success.message);
        obj.uploaded = true;
        this.viewCntrl.dismiss(obj);
      }, error => {
        this.utils.openToast("Somrthing went wrong", "Ok");
        this.utils.stopLoader();
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
