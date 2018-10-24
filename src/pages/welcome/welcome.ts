import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides } from 'ionic-angular';
// import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { CurrentUserProvider } from '../../providers/current-user/current-user';
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../tabs/tabs';
import { Network } from '@ionic-native/network';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { UtilsProvider } from '../../providers/utils/utils';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
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
    { title: "Slide 2" },
    { title: "Slide 3" }
  ];
  responseData: any;
  token: any;
  networkAvailable: boolean;
  subscription: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage,
    private auth: AuthProvider, private currentUser: CurrentUserProvider,
    private toastCtrl: ToastController, private network: Network, private netwrkGpsProvider: NetworkGpsProvider,
    private permissions: AndroidPermissions, private geolocation: Geolocation,
    private diagnostic: Diagnostic, private utils: UtilsProvider, private locationAccuracy: LocationAccuracy) {
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
    this.diagnostic.isLocationEnabled().then(success => {
      console.log(success)
      if (success) {
        this.auth.doOAuthStepOne().then(code => {
          this.responseData = JSON.stringify(code);
          return this.auth.doOAuthStepTwo(code);
        }).then(response => {
          this.auth.checkForCurrentUserLocalData(response);
        })
      } else {
        this.netwrkGpsProvider.checkForLocationPermissions();
      }
    }).catch(error => {
      this.netwrkGpsProvider.checkForLocationPermissions();
    })
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
