import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { ReportEntityListingPage } from '../report-entity-listing/report-entity-listing';

/**
 * Generated class for the RoleDashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-role-dashboard',
  templateUrl: 'role-dashboard.html',
})
export class RoleDashboardPage {
  roles = [];
  entityType: any;

  constructor(public navCtrl: NavController,
    private localStorageProvider: LocalStorageProvider, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RoleDashboardPage');
    this.localStorageProvider.getLocalStorage('profileRole').then(success =>{
      this.roles = success.result.roles;
      // this.entityType = success.result.roles.entityType
       console.log(JSON.stringify(success))
    }).catch();
  }
  roleSelected(role){
    console.log(JSON.stringify(role))
    this.navCtrl.push(ReportEntityListingPage ,{  "currentEntityType" : role.entityType, "data" : role.entities  , "entityType" : role.entities[0].entityType})
  }
}
