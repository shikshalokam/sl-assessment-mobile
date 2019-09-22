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

  constructor(public navCtrl: NavController, public utils: UtilsProvider, public navParams: NavParams ,private apiProvider : ApiProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardPage');
    // this.data = this.navParams.get('data');
    this.entity = this.navParams.get('entity');
    this.programId = this.navParams.get('programId');
    this.solutionId = this.navParams.get('solutionId');

    this.getEntityReports();
  }
  getEntityReports() {

    console.log(JSON.stringify(this.entity))
    this.utils.startLoader();
    this.apiProvider.httpPost(AppConfigs.roles.instanceReport,{
      "entityId" : this.entity._id,
      "programId":this.programId,
      "solutionId":this.solutionId,
      "entityType":this.entity.entityType,
      "immediateChildEntityType": this.entity.immediateSubEntityType ? this.entity.immediateSubEntityType :  this.entity.immediateChildEntityType ? this.entity.immediateChildEntityType :""
    },success =>{
     this.data = success
    console.log(JSON.stringify(success))
      this.utils.stopLoader();
    },error=>{
      this.utils.stopLoader();
      console.log("error");
      this.utils.openToast(error)
    },{"dhiti":true})  }

}
