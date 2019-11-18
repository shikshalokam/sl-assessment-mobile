import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FCM } from '@ionic-native/fcm';
import { Platform } from 'ionic-angular';

@Injectable()
export class FcmProvider {

  constructor(
    public http: HttpClient,
    private fcm: FCM,
    private platform: Platform) {
    console.log('Hello FcmProvider Provider');
  }

  getDeviceToken(): Promise<any> {
    return new Promise((resolve, reject) => {
      // if (deviceToken) {

      // }
    })

  }

  initializeFCM() {
    if (this.platform.is('android')) {
      this.initializeFirebaseAndroid()
    } else {
      this.initializeFirebaseIOS()
    }
  }

  initializeFirebaseAndroid() {
    this.fcm.getToken().then(token => { 
      console.log("Device Token  ", token);
      this.subscribeToChannels();

    });
    this.fcm.onTokenRefresh().subscribe(token => { })
  }

  initializeFirebaseIOS() {

  }

  subscribeToChannels() {
    console.log("inside subscribe channel")
    this.fcm.subscribeToTopic('allUsers').then(success => {
      console.log("subscribed");
      console.log(JSON.stringify(success));
      this.subscribeToPushNotifications();
    }).catch(error => {
      console.log("not subscribed");
      console.log(JSON.stringify(error))
    })
  }

  subscribeToPushNotifications() {
    this.fcm.onNotification().subscribe(data => {
      console.log("On notification received");
      console.log(JSON.stringify(data))
      if (data.wasTapped) {
        console.log("Received in background");
      } else {
        console.log("Received in foreground");
      };
    },error => {
      console.log("Error of subscribeTo Push notification");
    });
  }

}
