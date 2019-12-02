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
  notifications = [];
  page = 1;
  limit = 20;
  totalCount;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private notificationService: NotificationProvider,
    private utils: UtilsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationListingPage');
    // this.notifications = [];
    this.fetchAllNotifications();
  }

  fetchAllNotifications(infinateScrollRefrnc?) {
    infinateScrollRefrnc ? null : this.utils.startLoader()
    this.notificationService.getAllNotifications(this.page, this.limit).then(success => {
      this.notificationService.checkForNotificationApi();
      this.totalCount = success['count'];
      this.notifications = this.notifications.concat(success['data']);
      infinateScrollRefrnc ? infinateScrollRefrnc.complete() : this.utils.stopLoader();
    }).catch(error => {
      infinateScrollRefrnc ? infinateScrollRefrnc.complete() : this.utils.stopLoader();
    })
  }

  loadMore() {
    this.page++;
    this.fetchAllNotifications()
  }

  // doInfinite(infiniteScroll) {
  //   console.log('Begin async operation');
  //   if ((this.page * this.limit) < this.totalCount) {
  //     this.page++
  //     this.fetchAllNotifications(infiniteScroll)
  //   } else {
  //     infiniteScroll.enable(false)
  //   }
  // }



}
