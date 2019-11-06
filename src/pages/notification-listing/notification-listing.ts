import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NotificationProvider } from '../../providers/notification/notification';
import { UtilsProvider } from '../../providers/utils/utils';

@IonicPage()
@Component({
  selector: 'page-notification-listing',
  templateUrl: 'notification-listing.html',
})
export class NotificationListingPage {
  notifications;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private notificationService: NotificationProvider,
    private utils: UtilsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationListingPage');
    this.fetchAllNotifications();
  }

  fetchAllNotifications() {
    this.utils.startLoader()
    this.notificationService.getAllNotifications().then(success => {
      this.notifications = success;
      this.utils.stopLoader();
    }).catch(error => {
      this.utils.stopLoader();
    })
  }



}
