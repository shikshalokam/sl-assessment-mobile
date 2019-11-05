import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ApiProvider } from '../api/api';

@Injectable()
export class NotificationProvider {

  $notificationData = new Subject<any>()

  constructor(public http: HttpClient, private apiService : ApiProvider) {
    console.log('Hello NotificationProvider Provider');
  }

  startNotificationPooling() {
    
  }

  checkForNotificationApi() {

  }

  stopNotificationPooling() {
    
  }

}
