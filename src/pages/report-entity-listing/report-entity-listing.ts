import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { AppConfigs } from '../../providers/appConfig';
import { UtilsProvider } from '../../providers/utils/utils';
import { DashboardPage } from '../dashboard/dashboard';

/**
 * Generated class for the ReportEntityListingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-report-entity-listing',
  templateUrl: 'report-entity-listing.html',
})
export class ReportEntityListingPage {
  entities: any;
  instanceReportData: any;
  entityType ;
  currentEntityType: any;
  constructor(public navCtrl: NavController,
    private utils : UtilsProvider,
    private apiProvider : ApiProvider , public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportEntityListingPage');
    this.entities = this.navParams.get('data');
    this.entityType = this.navParams.get('entityType');
    this.currentEntityType = this.navParams.get('currentEntityType');

    this.currentEntityType = this.currentEntityType ? this.currentEntityType : this.entityType
    console.log(JSON.stringify(this.navParams))
  }
  selectEntity(entity){
    console.log("select entity")
    if(entity.entityType){
    let url = entity._id ? AppConfigs.roles.entityList+entity._id+"?type="+entity.entityType : AppConfigs.roles.entityList+entity.entityId+"?type="+entity.entityType
    this.apiProvider.httpGet(url,success =>{
      console.log(success.result[0].entityType)
      this.navCtrl.push(ReportEntityListingPage , {data :  success.result , "entityType":entity.entityType } );
    },error=>{
      this.utils.openToast(error)
        })
   }
  }
  viewReport(){

  }
  viewInstanceReport(entity){
console.log("api called")
    this.apiProvider.httpPost(AppConfigs.roles.instanceReport,{"entityId" : entity._id},success =>{
      this.instanceReportData = success;
      this.navCtrl.push(DashboardPage , { "data" :success} )
      console.log(JSON.stringify(success))

    },error=>{
      console.log("error");
      this.utils.openToast(error)
    },{"dhiti":true})
  }

}
