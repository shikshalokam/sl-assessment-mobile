import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FCM } from '@ionic-native/fcm';
import { Platform } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { AppConfigs } from '../appConfig';
import { LocalStorageProvider } from '../local-storage/local-storage';
import { CurrentUserProvider } from '../current-user/current-user';

@Injectable()
export class FcmProvider {

  fcmDeviceId: string;

  constructor(
    public http: HttpClient,
    private fcm: FCM,
    private localNotification: LocalNotifications,
    private localStorage: LocalStorageProvider,
    private currentUser: CurrentUserProvider,
    private platform: Platform) {
    console.log('Hello FcmProvider Provider');


  }

  initializeFCM() {
    if (this.platform.is('android')) {
      this.initializeFirebaseAndroid()
    } else {
      this.initializeFirebaseIOS()
    }
  }


  async initializeFirebaseAndroid() {
    this.localStorage.getLocalStorage('deviceId').then(token => {
      this.fcmDeviceId = token;
    }).catch(error => {
      this.fcm.getToken().then(token => {
        console.log("Device Token  ", token);
        this.fcmDeviceId = token;
        this.localStorage.setLocalStorage('deviceId', token);
        // this.subscribeToChannels('allUsers');
        this.subscribeToPushNotifications();
        this.localNotificationClickHandler();
      }).catch(error => {

      });
    })


    this.fcm.onTokenRefresh().subscribe(token => {
      this.fcmDeviceId = token;
      this.localStorage.setLocalStorage('deviceId', token);
      this.registerDeviceID();
    })
  }

  subscribeToPushNotifications() {
    this.fcm.onNotification().subscribe(notificationData => {
      //Will be triggered if the user clicks on the notification and come to the app
      if (notificationData.wasTapped) {
        console.log("Received in background");
        this.notificationClickActions(notificationData);
      } else {
        //Will be triggered if the user is using the app(foreground);
        // console.log(JSON.stringify(notificationData))
        this.triggerLocalNotification(notificationData);
      };
    }, error => {
      console.log("Error of subscribeTo Push notification");
    });
  }


  localNotificationClickHandler() {
    this.localNotification.on('click').subscribe(success => {
      this.notificationClickActions(success);
    })
  }

  triggerLocalNotification(notificationData) {
    delete notificationData.body
    delete notificationData.wasTapped;
    this.localNotification.schedule(notificationData);
  }

  registerDeviceID(token?: string) {
    const url = AppConfigs.kendra_base_url + AppConfigs.notification.registerDevice;
    const payload = {
      deviceId: this.fcmDeviceId
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'x-authenticated-user-token': token ? token : this.currentUser.curretUser.accessToken,
        'app': AppConfigs.appName.toLowerCase(),
        'os': this.platform.is('android') ? 'android' : 'ios'
      })
    };
    this.http.post(url, payload, httpOptions).subscribe(success => {
      console.log("==========================================================================")
      console.log("Successfully registered token");
      console.log("==========================================================================")

    }, error => {
      console.log("Error while registering token");
    })
  }

  initializeFirebaseIOS() {

  }

  // subscribeToChannels(topic: string) {
  //   this.fcm.subscribeToTopic(topic).then(success => {
  //     this.subscribeToPushNotifications();
  //   }).catch(error => { })
  // }

  notificationClickActions(notificationMeta) {
    alert(JSON.stringify(notificationMeta))
  }

}
