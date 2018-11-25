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
  }

  getFeedbackForm(): void {
    this.apiService.httpGet(AppConfigs.feedback.getFeedbackForm, success => {
      this.feedbackForm = this.utils.createFormGroup(success.result);
      console.log(JSON.stringify(success))
    }, error => {

    })
  }

  update(): void {
    const payload = { "parents": [] }
    // this.storage.set('ParentInfo', this.parentInfoList);
    if (this.networkConnected) {
      this.utils.startLoader();
      this.apiService.httpPost(AppConfigs.parentInfo.addParentsInfo, payload, success => {
        this.utils.stopLoader();
        this.utils.openToast(success.message)
      }, error => {
        this.utils.stopLoader()
      })
    } else {
      this.utils.openToast("Parent details updated");
    }

    // this.viewCntrl.dismiss(this.form.value)
  }

  cancel(): void {
    this.viewCntrl.dismiss();
  }

}
