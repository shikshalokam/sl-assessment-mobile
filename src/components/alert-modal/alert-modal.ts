import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Market } from '@ionic-native/market';
import { AppVersion } from '@ionic-native/app-version';
import { NotificationProvider } from '../../providers/notification/notification';

@Component({
  selector: 'alert-modal',
  templateUrl: 'alert-modal.html'
})
export class AlertModalComponent {

  @Input() notificationMeta;
  @Output() closeModal = new EventEmitter();

  constructor(
    private market: Market,
    private appVersion: AppVersion,
    private notifctnServ: NotificationProvider) {
    console.log('Hello AlertModalComponent Component');
  }

  openAppStore() {
    this.markAsRead();
    this.appVersion.getPackageName().then(success => {
      this.market.open(success)
    })
  }

  markAsRead() {
    if (!this.notificationMeta.is_read) {
      this.notifctnServ.markAsRead(this.notificationMeta.id);
      this.notificationMeta.is_read = true;
    }
  }

  close() {
    this.markAsRead();
    this.closeModal.emit();
  }


}
