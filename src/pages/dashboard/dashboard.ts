import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppConfigs } from '../../providers/appConfig';
import { ApiProvider } from '../../providers/api/api';
import { UtilsProvider } from '../../providers/utils/utils';

/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {
  data: any;
  entity: any;
  programId: any;
  solutionId: any;

  constructor(public navCtrl: NavController, public utils: UtilsProvider, public navParams: NavParams, private apiProvider: ApiProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardPage');
    // this.data = this.navParams.get('data');
    this.entity = this.navParams.get('entity');
    this.programId = this.navParams.get('programId');
    this.solutionId = this.navParams.get('solutionId');

    this.getEntityRequestObject();
  }
  getEntityRequestObject() {

    console.log(JSON.stringify(this.entity))
    let obj = {
      "entityId": this.entity._id,
      "programId": this.programId,
      "solutionId": this.solutionId,
      "entityType": this.entity.entityType,
      "immediateChildEntityType": this.entity.immediateSubEntityType ? this.entity.immediateSubEntityType : this.entity.immediateChildEntityType ? this.entity.immediateChildEntityType : ""
    }
    this.getEntityReports(obj);
  }

  clickOnGraphEventEmit(event) {
    console.log(JSON.stringify(event))
    let entityObj = {
      _id : event.entityId,
      entityType : event.nextChildEntityType,
      immediateChildEntityType : event.grandChildEntityType
    }
    this.navCtrl.push(DashboardPage ,{ "entity" :entityObj,"programId" : this.programId , "solutionId":this.solutionId} )
  }
  getEntityReports(obj) {
    console.log(JSON.stringify(obj))
    this.utils.startLoader();
    this.apiProvider.httpPost(AppConfigs.roles.instanceReport, obj, success => {
      this.data = success
      console.log(JSON.stringify(success))
      this.utils.stopLoader();
    }, error => {
      this.utils.stopLoader();
      console.log("error");
      this.utils.openToast(error)
    }, { "dhiti": true })
  }
}
