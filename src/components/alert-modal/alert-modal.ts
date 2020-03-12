import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Market } from '@ionic-native/market';
import { AppVersion } from '@ionic-native/app-version';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';

@Component({
  selector: 'alert-modal',
  templateUrl: 'alert-modal.html'
})
export class AlertModalComponent {

  @Input() notificationMeta;
  @Output() closeModal = new EventEmitter();
  currentAppVersionObj;

  constructor(
    private market: Market,
    private appVersion: AppVersion,
    private localStorage: LocalStorageProvider) {
    this.localStorage.getLocalStorage('appUpdateVersions').then(obj => {
      this.currentAppVersionObj = obj;
    }).catch(error => {
      this.currentAppVersionObj = {};
    })
  }

  openAppStore() {
    this.appVersion.getPackageName().then(success => {
      this.currentAppVersionObj[this.notificationMeta.payload.appVersion] = 'accepted';
      this.localStorage.setLocalStorage('appUpdateVersions', this.currentAppVersionObj);
      this.market.open(success);
      this.closeModal.emit();
    })
  }

  close() {
    this.closeModal.emit();
    this.currentAppVersionObj[this.notificationMeta.payload.appVersion] = 'rejected';
    this.localStorage.setLocalStorage('appUpdateVersions', this.currentAppVersionObj);
  }


}
