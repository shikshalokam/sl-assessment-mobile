import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';


@Injectable()
export class UtilsProvider {

  constructor(public http: HttpClient, public loadingCtrl: LoadingController,
     private toastCtrl: ToastController, private storage: Storage) {
    console.log('Hello UtilsProvider Provider');
  }
  loading: any;

  startLoader() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

  stopLoader() {
    this.loading.dismiss();
  }

  openToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
  
    toast.onDidDismiss(() => {
      // console.log('Dismissed toast');
    });
  
    toast.present();
  }

  setLocalSchoolData(data) {
    this.storage.set('schoolsDetails', JSON.stringify(data));
  }

}
