import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { Storage } from "@ionic/storage"
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsProvider } from '../../providers/utils/utils';
import { ApiProvider } from '../../providers/api/api';
import { AppConfigs } from '../../providers/appConfig';
import { NetworkGpsProvider } from '../../providers/network-gps/network-gps';

@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
})
export class FeedbackPage {

  feedbackForm: any;
  networkConnected: boolean;
  form: FormGroup;
  schoolId:string;
  schoolName: string;
  programId: string;
  submissionId: any;

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
    console.log('ionViewDidLoad FeedbackPage');
    this.getFeedbackForm();
    this.schoolId = this.navParams.get('schoolId');
    this.schoolName  = this.navParams.get('schoolName');
    this.programId = this.navParams.get('programId');
    this.submissionId = this.navParams.get('submissionId')
  }

  getFeedbackForm(): void {
    console.log("api")
    this.utils.startLoader()
    this.apiService.httpGet(AppConfigs.feedback.getFeedbackForm, success => {
      console.log("inside")
      // const validForms = [];
      // for (const field of success.result) {
      //   if(field.visible) {
      //     validForms.push(field)
      //   }
      // }
      this.feedbackForm = success.result;
      this.form = this.createFormGroup();
      this.utils.stopLoader();
      console.log(JSON.stringify(success))
    }, error => {
      this.utils.stopLoader();
    })
  }

  checkForVisibility(field) {
    if (field.visibleIf) {
      const visibility = eval('"' + this.form['controls'][field.visibleIf[0].field].value + '"' + field.visibleIf[0].operator + '"' + field.visibleIf[0].value + '"');
      // if(visibility && field.validation.required) {
      //   this.form.controls[field.field].setValidators([Validators.required])
      // } else if(visibility && field.validation.required) {
      //   this.form.controls[field.field].setValidators([])
      // }
      return visibility
    } else {
      return true
    }
  }

  createFormGroup(): any {
    let formGrp = {};
    this.feedbackForm.forEach(formfield => {
        formGrp[formfield.field] = formfield.validation.required ? new FormControl(formfield.value || this[formfield.field] ||"", Validators.required) : new FormControl(formfield.value || "");
    });
    return new FormGroup(formGrp)
  }

  update(): void {
    const payload = { "feedback": this.form.value }
    console.log(JSON.stringify(payload))
    if (this.networkConnected) {
      this.utils.startLoader();
      console.log(AppConfigs.feedback.submitFeedback + this.submissionId)
      this.apiService.httpPost(AppConfigs.feedback.submitFeedback + this.submissionId, payload, success => {
        this.utils.stopLoader();
        this.utils.openToast(success.message);
        this.viewCntrl.dismiss()
      }, error => {
        this.utils.stopLoader();
        this.utils.openToast(error.message);
      })
    } else {
      this.utils.openToast("You need network connection for this action.", "Ok");
    }

  }

  cancel(): void {
    this.viewCntrl.dismiss();
  }

}
