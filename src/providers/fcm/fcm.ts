import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FCM } from '@ionic-native/fcm';
import { Platform } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Injectable()
export class FcmProvider {

  constructor(
    public http: HttpClient,
    private fcm: FCM,
    private localNotification: LocalNotifications,
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

  initializeFirebaseAndroid() {
    this.fcm.getToken().then(token => {
      console.log("Device Token  ", token);
      this.subscribeToChannels('allUsers');
      this.localNotificationClickHandler();
    });
    this.fcm.onTokenRefresh().subscribe(token => { })
  }


  localNotificationClickHandler() {
    this.localNotification.on('click').subscribe(success => {
      this.notificationClickActions(success);
      console.log(JSON.stringify(success))
    })
  }

  triggerLocalNotification(notificationData) {
    delete notificationData.body
    delete notificationData.wasTapped;
    this.localNotification.schedule(notificationData);
  }

  initializeFirebaseIOS() {

  }

  subscribeToChannels(topic: string) {
    this.fcm.subscribeToTopic(topic).then(success => {
      this.subscribeToPushNotifications();
    }).catch(error => { })
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


  notificationClickActions(notificationMeta) {
    alert()
  }

}
