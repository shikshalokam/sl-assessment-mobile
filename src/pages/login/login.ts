import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { CurrentUserProvider } from '../../providers/current-user/current-user';
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../tabs/tabs';
import { Network } from '@ionic-native/network';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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
    private toastCtrl: ToastController, private network: Network) {
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
    if(this.network.type != 'none'){
      this.networkAvailable = true;
    }
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
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
