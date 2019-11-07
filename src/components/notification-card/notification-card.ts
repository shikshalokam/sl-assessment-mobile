import { Component, Input } from '@angular/core';
import { App, NavParams, ViewController } from 'ionic-angular';
import { NotificationProvider } from '../../providers/notification/notification';

@Component({
  selector: 'notification-card',
  templateUrl: 'notification-card.html'
})
export class NotificationCardComponent {

  text: string;


  @Input() notifications;
  @Input() showViewMore;

  constructor(private appCtrl: App, private navParams: NavParams,
    private viewCtrl: ViewController, private notificationProvider: NotificationProvider) {
    console.log('Hello NotificationCardComponent Component');
    this.text = 'Hello World';
    this.showViewMore = this.navParams.get('showViewMore');
    this.notifications = this.navParams.get('data');
  }

  goToAllNotifications() {
    this.appCtrl.getRootNav().push('NotificationListingPage');
    this.viewCtrl.dismiss();
  }

  onNotificationClick(notificationMeta) {
    switch (notificationMeta.action) {
      case 'mapping':
        this.notificationProvider.getMappedAssessment(notificationMeta)
        break
    }
    if(!notificationMeta.is_read){
      this.markAsRead(notificationMeta.id);
    }
    this.viewCtrl.dismiss();
  }

  markAsRead(id) {
    this.notificationProvider.markAsRead(id).then(success => {
      this.notificationProvider.checkForNotificationApi();
    }).catch(error => {
    })
  }





}
