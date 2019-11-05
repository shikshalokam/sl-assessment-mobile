import { Component, Input } from '@angular/core';
import { App, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'notification-card',
  templateUrl: 'notification-card.html'
})
export class NotificationCardComponent {

  text: string;


  @Input() notifications = [
    {
      "_id": "5dc12b56df249c36ac6aae76",
      "user_id": "e97b5582-471c-4649-8401-3cc4249359bb",
      "text": "New solution available now (Observation form)",
      "type": "information",
      "action": "mapping",
      "is_read": true,
      "payload": {
        "type": "observation",
        "solution_id": "5d15b0d7463d3a6961f91749",
        "observation_id": "5d1a002d2dfd8135bc8e1615"
      },
      "created_at": "2019-11-05T07:57:10.920Z"
    }
  ];

  @Input() showViewMore;

  constructor(private appCtrl: App, private navParams: NavParams, private viewCtrl: ViewController) {
    console.log('Hello NotificationCardComponent Component');
    this.text = 'Hello World';
    this.showViewMore = this.navParams.get('showViewMore');
  }

  goToAllNotifications() {
    this.appCtrl.getRootNav().push('NotificationListingPage');
    this.viewCtrl.dismiss();
  }

}
