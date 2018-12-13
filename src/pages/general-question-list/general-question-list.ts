import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { GeneralQuestionPage } from '../general-question/general-question';
import { NetworkGpsProvider } from '../../providers/network-gps/network-gps';
import { Diagnostic } from '@ionic-native/diagnostic';
import { GeneralQuestionSubmitPage } from '../general-question-submit/general-question-submit';
import { UtilsProvider } from '../../providers/utils/utils';
import { Network } from '@ionic-native/network';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private utils: UtilsProvider,
    private modal: ModalController, private events: Events, private ngps: NetworkGpsProvider,  private diagnostic: Diagnostic,
    private alertCntrl: AlertController, private network: Network) {
    this.events.subscribe('network:offline', () => {
    });

    // Online event
    this.events.subscribe('network:online', () => {
    });
    this.networkAvailable = this.ngps.getNetworkStatus()
  }

  ionViewWillEnter() {
    console.log('ionViewDidLoad GeneralQuestionListPage');
    this.schoolId = this.navParams.get('_id')
    this.storage.get('generalQuestions').then( data => {
      if(data){
        this.allGeneralQuestions = JSON.parse(data);
        this.generalQuestions = this.allGeneralQuestions[this.schoolId];
        this.enableSubmitBtn = this.enableGeneralaSubmission();
      }
    }).catch(error => {

    })
  }

  OpenQuestionModal(index) {
    // console.log(JSON.stringify(this.generalQuestions[index]));
    const modal = this.modal.create(GeneralQuestionPage, {"question":JSON.parse(JSON.stringify(this.generalQuestions[index])), schoolId: this.schoolId});
    modal.onDidDismiss(data => {
      if(data) {
        this.generalQuestions[index] = data;
        console.log(JSON.stringify(data));
        this.enableSubmitBtn = this.enableGeneralaSubmission();
        this.storage.set('generalQuestions', JSON.stringify(this.allGeneralQuestions));
      }
    })
    modal.present();
  }

  enableGeneralaSubmission(): boolean {
    let completed = false;
    for (const question of this.generalQuestions) {
      if(question.isCompleted){
        return true
      }
    }
    return false
  }

  checkForNetworkTypeAlert() {
    if(this.network.type !== ('3g' || '4g' || 'wifi')){
      let alert = this.alertCntrl.create({
        title: 'Confirm',
        message: 'You are connected to a slower data network. Image upload may take longer time. Do you want to continue?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
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
    if(this.networkAvailable) {
      // this.diagnostic.isLocationEnabled().then(success => {
        // if (success) {
          const params = {
            _id: this.schoolId,
          }
          this.navCtrl.push(GeneralQuestionSubmitPage, params);
        // } else {
          // this.ngps.checkForLocationPermissions();
        // }
      // }).catch(error => {
      // })
    } else {
      this.utils.openToast("Please enable network to continue");
    }
    

  }

}
