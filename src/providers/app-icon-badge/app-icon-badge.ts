import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Badge } from '@ionic-native/badge';

@Injectable()
export class AppIconBadgeProvider {

  constructor(public http: HttpClient, private badge: Badge) {
    console.log('Hello AppIconBadgeProvider Provider');
  }

  setBadge(count: number) {
    this.badge.isSupported().then((success: Boolean) => {
      if (success) {
        this.badge.set(count).then(success => {
        }).catch(error => { })
      }
    }).catch(error => { })
  }

  clearTheBadge() {
    this.badge.clear().then(success => {
    }).catch(error => {
    })
  }
}
