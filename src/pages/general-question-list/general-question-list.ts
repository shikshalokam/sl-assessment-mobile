import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events, AlertController } from 'ionic-angular';
import { GeneralQuestionPage } from '../general-question/general-question';
import { NetworkGpsProvider } from '../../providers/network-gps/network-gps';
import { GeneralQuestionSubmitPage } from '../general-question-submit/general-question-submit';
import { UtilsProvider } from '../../providers/utils/utils';
import { Network } from '@ionic-native/network';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';

@IonicPage()
@Component({
  selector: 'page-general-question-list',
  templateUrl: 'general-question-list.html',
})
export class GeneralQuestionListPage {

  generalQuestions: any;
  schoolId: any;
  allGeneralQuestions: any;
  enableSubmitBtn: boolean = false;
  networkAvailable: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private utils: UtilsProvider,
    private modal: ModalController, private events: Events, private ngps: NetworkGpsProvider,
    private alertCntrl: AlertController, private network: Network, private localStorage: LocalStorageProvider) {
    this.events.subscribe('network:offline', () => {
    });

    // Online event
    this.events.subscribe('network:online', () => {
    });
    this.networkAvailable = this.ngps.getNetworkStatus()
  }

  ionViewWillEnter() {
    this.schoolId = this.navParams.get('_id');
    this.localStorage.getLocalStorage('generalQuestions_' + this.schoolId).then(data => {
      if (data) {
        this.allGeneralQuestions = data;
        this.generalQuestions = this.allGeneralQuestions;
        this.enableSubmitBtn = this.enableGeneralaSubmission();
      }
    }).catch(error => {
    })
  }

  OpenQuestionModal(index) {
    const modal = this.modal.create(GeneralQuestionPage, { "question": JSON.parse(JSON.stringify(this.generalQuestions[index])), schoolId: this.schoolId });
    modal.onDidDismiss(data => {
      if (data) {
        this.generalQuestions[index] = data;
        this.enableSubmitBtn = this.enableGeneralaSubmission();
        this.localStorage.setLocalStorage('generalQuestions_' + this.schoolId, this.allGeneralQuestions)
      }
    })
    modal.present();
  }

  enableGeneralaSubmission(): boolean {
    let completed = false;
    for (const question of this.generalQuestions) {
      if (question.isCompleted) {
        return true
      }
    }
    return false
  }

  checkForNetworkTypeAlert() {
    if (this.network.type !== ('3g' || '4g' || 'wifi')) {
      let alert = this.alertCntrl.create({
        title: 'Confirm',
        message: 'You are connected to a slower data network. Image upload may take longer time. Do you want to continue?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            handler: () => {
            }
          },
          {
            text: 'Yes',
            handler: () => {
              this.goToImageListing()
            }
          }
        ]
      });
      alert.present();
    }
  }


  goToImageListing() {
    this.ngps.checkForLocationPermissions();
    if (this.networkAvailable) {
      const params = {
        _id: this.schoolId,
      }
      this.navCtrl.push(GeneralQuestionSubmitPage, params);
    } else {
      this.utils.openToast("Please enable network to continue");
    }


  }

}
