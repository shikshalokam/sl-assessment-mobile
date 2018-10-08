import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  responseData: any;
  token: any;
  networkAvailable: boolean;
  subscription: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage,
    private auth: AuthProvider, private currentUser: CurrentUserProvider,
    private toastCtrl: ToastController, private network: Network,
    private permissions: AndroidPermissions, private geolocation: Geolocation,
    private diagnostic: Diagnostic, private utils: UtilsProvider) {
    this.subscription = this.network.onDisconnect().subscribe(() => {
      this.presentToast('Network was disconnected :-(');
      this.networkAvailable = false
    });

    let connectSubscription = this.network.onConnect().subscribe(() => {
      this.networkAvailable = true;
      this.presentToast('Network is connected :-(');

      // We just got a connection but we need to wait briefly
      // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.

    });
    this.subscription.add(connectSubscription);
  }

  ionViewDidLoad() {
    this.checkForLocationPermissions();
    

    if (this.network.type != 'none') {
      this.networkAvailable = true;
    }
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  
  getCurrentLocation(): void {
    console.log('getting current location')
    this.geolocation.getCurrentPosition().then((resp) => {
      this.utils.openToast(JSON.stringify(resp))
  
    }).catch((error) => {
      this.utils.openToast('Error getting location' + JSON.stringify(error))
    });
  }

  isLocationEnabled() {
    console.log('Is location enabled');
    this.diagnostic.isLocationAvailable().then(isAvailable => {
      console.log("Location enabled" + isAvailable)
      if (isAvailable) {
        this.getCurrentLocation();
      } else {
        console.log('GPS offf')
      }
    }).catch(error => {

    })
  }

  checkForLocationPermissions(): void {
    console.log('Check permissions');
    this.permissions.checkPermission(this.permissions.PERMISSION.ACCESS_FINE_LOCATION).then(
      result => {
        console.log('Has permission?', result.hasPermission)
        if (!result.hasPermission) {
          console.log("ask permission");
          this.permissions.requestPermission(this.permissions.PERMISSION.ACCESS_FINE_LOCATION).then(result => {
            if(result.hasPermission) {
              this.isLocationEnabled();
            }
          }).catch(error => {
            console.log('error')
          })
        } else {
          console.log('yes, Has permission');
          this.isLocationEnabled();
        }
      }).catch(error => {
        console.log("Error check for permission" + JSON.stringify(error))
      });
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
    this.auth.doOAuthStepOne()
      .then(code => {
        this.responseData = JSON.stringify(code);
        return this.auth.doOAuthStepTwo(code);
      }).then(response => {
        this.navCtrl.push(TabsPage);
        this.presentToast("Login Successful")
      })
  }

}
