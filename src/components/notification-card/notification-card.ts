import { Component, Input } from '@angular/core';
import { App, NavParams } from 'ionic-angular';
import { NotificationProvider } from '../../providers/notification/notification';
import * as moment from 'moment';

@Component({
  selector: 'notification-card',
  templateUrl: 'notification-card.html'
})
export class NotificationCardComponent {

  text: string;


  @Input() notifications;
  @Input() showViewMore;
  time = Date.now()
  momentInstance = moment;

  constructor(private appCtrl: App, private navParams: NavParams,
    private notificationProvider: NotificationProvider) {
    console.log('Hello NotificationCardComponent Component');
    this.text = 'Hello World';
    this.showViewMore = this.navParams.get('showViewMore');
    this.notifications = this.navParams.get('data');
  }

  goToAllNotifications() {
    this.appCtrl.getRootNav().push('NotificationListingPage');
  }

  onNotificationClick(notificationMeta, index) {
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
      case 'alertModal':
        this.notificationProvider.$alertModalSubject.next(notificationMeta)  
    }
    if (!notificationMeta.is_read) {
      this.markAsRead(notificationMeta.id, index);
    }
  }

  markAsRead(id, index) {
    this.notificationProvider.markAsRead(id).then(success => {
      this.notificationProvider.checkForNotificationApi();
      this.notifications[index].is_read = true;
    }).catch(error => {
    })
  }


}
