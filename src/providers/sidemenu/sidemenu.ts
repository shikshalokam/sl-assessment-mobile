import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { LocalStorageProvider } from '../local-storage/local-storage';
import { CurrentUserProvider } from '../current-user/current-user';
import { ApiProvider } from '../api/api';
import { AppConfigs } from '../appConfig';
import { UtilsProvider } from '../utils/utils';

@Injectable()
export class SidemenuProvider {

  $showDashboard = new Subject<boolean>();
  profileRoles;

  constructor(
    public http: HttpClient,
    private localStorage: LocalStorageProvider,
    private currentUser: CurrentUserProvider,
    private apiProvider: ApiProvider,
    private utils: UtilsProvider
  ) {
    console.log('Hello SidemenuProvider Provider');
  }

  getUserRoles() {
    this.localStorage.getLocalStorage('profileRole').then(success => {
      this.profileRoles = success;
      this.$showDashboard.next(success.roles.length > 0 ? true : false);
    }).catch(error => {
      this.getUserRolesApi();
    })
  }

  getUserRolesApi() {
    let currentUser = this.currentUser.getCurrentUserData();
    this.apiProvider.httpGet(AppConfigs.roles.getProfile + currentUser.sub, success => {
      this.profileRoles = success.result;
      this.localStorage.setLocalStorage('profileRole', this.profileRoles);
      this.$showDashboard.next((success.result.roles && success.result.roles.length > 0) ? true : false);
    }, error => {
      this.$showDashboard.next(false);
      this.utils.openToast(error);
    })
  }

}
