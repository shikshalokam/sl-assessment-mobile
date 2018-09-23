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
    // this.presentToast(this.network.type)
    // console.log(this.network.type);
    this.checkForLocationPermissions();
    // this.checkForCurrentLocation();
    // console.log(JSON.stringify(this.diagnostic.permissionGroups))
    // console.log(JSON.stringify(this.diagnostic.permission))
    // console.log(JSON.stringify(this.diagnostic.permissionStatus))
    // this.diagnostic.isLocationAuthorized().then(response => {
    //   console.log('isLocationAuthorized '+JSON.stringify(response))
    // })
    // this.diagnostic.isLocationAvailable().then(response => {
    //   console.log('isLocationAvailable '+ JSON.stringify(response))
    // })
    // this.diagnostic.isLocationEnabled().then(response =>{
    //   console.log('isLocationEnabled' + JSON.stringify(response))
    // })

    if (this.network.type != 'none') {
      this.networkAvailable = true;
    }
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  watchLocation() {
    console.log('Watch location')
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      console.log('location' + JSON.stringify(data))
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
    });
  }
  
  getCurrentLocation(): void {
    console.log('getting current location')
    this.geolocation.getCurrentPosition({timeout:5000, enableHighAccuracy: true}).then((resp) => {
      this.utils.openToast(JSON.stringify(resp))
      console.log('Current location is' + JSON.stringify(resp));
      // resp.coords.latitude
      // resp.coords.longitude
    }).catch((error) => {
      this.utils.openToast('Error getting location' + JSON.stringify(error))

      console.log('Error getting location', JSON.stringify(error));
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
          this.permissions.requestPermission(this.permissions.PERMISSION.ACCESS_FINE_LOCATION)
        } else {
          console.log('yes, Has permission');
          this.isLocationEnabled();
        }
      }).catch(error => {
        console.log("Error check for permission" + JSON.stringify(error))
      });
    // err => this.permissions.requestPermission(this.permissions.PERMISSION.ACCESS_FINE_LOCATION)
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
