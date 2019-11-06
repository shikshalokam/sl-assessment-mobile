import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ApiProvider } from '../api/api';
import { AppConfigs } from '../appConfig';

@Injectable()
export class NotificationProvider {

  $notificationSubject = new Subject<any>();
  notificationsData;

  constructor(public http: HttpClient, private apiService: ApiProvider) {
    console.log('Hello NotificationProvider Provider');
  }

  startNotificationPooling() {

  }

  checkForNotificationApi() {
    this.apiService.httpGet(AppConfigs.notification.getUnreadNotificationCount, success => {
      this.notificationsData = success.result;
      this.$notificationSubject.next(success.result);
    }, error => {
      this.notificationsData = {};
      this.$notificationSubject.next({});
    },
      { baseUrl: "kendra" })
  }

  getAllNotifications(){
    return new Promise((resolve, reject) => {
      this.apiService.httpGet(AppConfigs.notification.getAllNotifications, success => {
        resolve(success.result)
      }, error => {
        reject();
      },
        { baseUrl: "kendra" })
    })

  }

  stopNotificationPooling() {

  }

}
