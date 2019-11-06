import { Component, Input } from '@angular/core';
import { App, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'notification-card',
  templateUrl: 'notification-card.html'
})
export class NotificationCardComponent {

  text: string;


  @Input() notifications ;
  @Input() showViewMore;

  constructor(private appCtrl: App, private navParams: NavParams, private viewCtrl: ViewController) {
    console.log('Hello NotificationCardComponent Component');
    this.text = 'Hello World';
    this.showViewMore = this.navParams.get('showViewMore');
    this.notifications = this.navParams.get('data');
  }

  goToAllNotifications() {
    this.appCtrl.getRootNav().push('NotificationListingPage');
    this.viewCtrl.dismiss();
  }

}
