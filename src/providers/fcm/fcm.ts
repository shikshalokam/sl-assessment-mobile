import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FCM } from '@ionic-native/fcm';
import { Platform } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { AppConfigs } from '../appConfig';
import { LocalStorageProvider } from '../local-storage/local-storage';
import { CurrentUserProvider } from '../current-user/current-user';
import { NotificationProvider } from '../notification/notification';
import { ApiProvider } from '../api/api';

@Injectable()
export class FcmProvider {

  fcmDeviceId: string;

  constructor(
    public http: HttpClient,
    private fcm: FCM,
    private localNotification: LocalNotifications,
    private localStorage: LocalStorageProvider,
    private currentUser: CurrentUserProvider,
    private notificationProvider: NotificationProvider,
    private apiProvider: ApiProvider,
    private platform: Platform) {
    console.log('Hello FcmProvider Provider');
  }

  initializeFCM() {
    if (this.platform.is('android')) {
      this.initializeFirebaseAndroid()
    } else {
      this.initializeFirebaseAndroid()
    }
  }


  async initializeFirebaseAndroid() {
    this.subscribeToPushNotifications();
    this.localNotificationClickHandler();
    this.localStorage.getLocalStorage('deviceId').then(token => {
      this.fcmDeviceId = token;
    }).catch(error => {
      this.fcm.getToken().then(token => {
        this.fcmDeviceId = token;
        this.localStorage.setLocalStorage('deviceId', token);
        // this.subscribeToChannels('allUsers');
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
        this.notificationClickActions(notificationData);
      } else {
        //Will be triggered if the user is using the app(foreground);
        this.triggerLocalNotification(notificationData);
      };
    }, error => {
      console.log("Error of subscribeTo Push notification");
    });
  }


  localNotificationClickHandler() {
    this.localNotification.on('click').subscribe(success => {
      this.notificationClickActions(success.data);
    })
  }

  triggerLocalNotification(notificationData) {
    const obj = {
      title: notificationData.title,
      text: notificationData.text,
      foreground: true,
      priority: 2,
      id: notificationData.id,
      data: notificationData,
      color: AppConfigs.primary_color,
      icon: "notification_icon"
    }
    this.localNotification.schedule(obj);
  }

  registerDeviceID(token?: string) {
    // const url = AppConfigs.kendra_base_url + AppConfigs.notification.registerDevice;
    const payload = {
      deviceId: this.fcmDeviceId
    }
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'x-authenticated-user-token': token ? token : this.currentUser.curretUser.accessToken,
    //     'appName': AppConfigs.appName.toLowerCase(),
    //     'os': this.platform.is('android') ? 'android' : 'ios',
    //     appType: "assessment"
    //   })
    // };
    // this.http.post(url, payload, httpOptions).subscribe(success => {
    //   console.log("==========================================================================")
    //   console.log("Successfully registered token");
    //   console.log("==========================================================================")
    // }, error => {
    //   console.log("Error while registering token");
    // })

    this.apiProvider.httpPost(AppConfigs.notification.registerDevice, payload, success => {
      console.log("==========================================================================")
      console.log("Successfully registered token");
      console.log(JSON.stringify(success));
      console.log("==========================================================================")
    }, error => {
      console.log("Error while registering token");
    }, {"baseUrl":"kendra"})
  }

  initializeFirebaseIOS() {

  }

  // subscribeToChannels(topic: string) {
  //   this.fcm.subscribeToTopic(topic).then(success => {
  //     this.subscribeToPushNotifications();
  //   }).catch(error => { })
  // }

  notificationClickActions(notificationMeta) {
    notificationMeta.payload = JSON.parse(notificationMeta.payload)
    switch (notificationMeta.action) {
      case 'mapping':
        this.notificationProvider.getMappedAssessment(notificationMeta)
        break
      case 'viewOnly':
      case 'view_only':
        break
      case 'Pending':
      case 'pending':
        this.notificationProvider.goToDetails(notificationMeta);
        break
    }
    this.notificationProvider.markAsRead(notificationMeta.id);
  }

}
