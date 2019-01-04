import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides } from 'ionic-angular';
// import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network';
import { NetworkGpsProvider } from '../../providers/network-gps/network-gps';

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  @ViewChild(Slides) slides: Slides;

  skipMsg: string;
  slidesList = [
    {
      // title: "Slide 1",
      image: "assets/imgs/just-logo.png"
    },
    // { title: "Slide 2" },
    // { title: "Slide 3" }
  ];
  responseData: any;
  token: any;
  networkAvailable: boolean;
  subscription: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage,
    private auth: AuthProvider,
    private toastCtrl: ToastController, private network: Network, private netwrkGpsProvider: NetworkGpsProvider) {
    this.subscription = this.network.onDisconnect().subscribe(() => {
      // this.presentToast('Network was disconnected :-(');
      this.networkAvailable = false
    });

    let connectSubscription = this.network.onConnect().subscribe(() => {
      this.networkAvailable = true;
      // this.presentToast('Network is connected :-(');

      // We just got a connection but we need to wait briefly
      // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.

    });
    this.subscription.add(connectSubscription);
  }

  ionViewWillLeave() {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }


  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  signIn() {
    // this.diagnostic.isLocationEnabled().then(success => {
    //   console.log(success)
    //   if (success) {
        this.auth.doOAuthStepOne().then(code => {
          this.responseData = JSON.stringify(code);
          return this.auth.doOAuthStepTwo(code);
        }).then(response => {
          this.auth.checkForCurrentUserLocalData(response);
        })
      // } else {
      //   this.netwrkGpsProvider.checkForLocationPermissions();
      // }
    // }).catch(error => {
    //   this.netwrkGpsProvider.checkForLocationPermissions();
    // })
  }

  ionViewDidLoad() {
    this.skipMsg = "Skip";
    console.log('ionViewDidLoad WelcomePage');
    this.netwrkGpsProvider.checkForLocationPermissions();
    // this.checkForLocationPermissions();
    // this.gelLoc();

    if (this.network.type != 'none') {
      this.networkAvailable = true;
    }
  }

  slideChanged(): void {
    if (this.slides.isEnd()) {
      this.skipMsg = 'Got it';
    } else {
      this.skipMsg = "Skip";
    }
  }

  gotToLastSlide() {
    this.slides.slideTo(3);
  }

}
