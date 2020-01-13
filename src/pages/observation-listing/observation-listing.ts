import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { AppConfigs } from '../../providers/appConfig';
import { UtilsProvider } from '../../providers/utils/utils';
import { ObservationReportsPage } from '../observation-reports/observation-reports';
import { ActionSheetController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-observation-listing',
  templateUrl: 'observation-listing.html',
})
export class ObservationListingPage {

  entityDetails;
  solutionList;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private utils: UtilsProvider,
    private apiProvide: ApiProvider,
    public actionSheetCtrl: ActionSheetController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ObservationListingPage');
    this.entityDetails = this.navParams.get('entity');
    this.getObservationList();
  }

  presentActionSheet(solutionId) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select report type',
      buttons: [
        {
          text: 'Report with score',
          role: 'destructive',
          handler: () => {
            this.goToScoringReportOfSolution(solutionId)
          }
        },
        {
          text: 'Report without score',
          handler: () => {
            this.goToReportsOfSolution(solutionId)
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }

  getObservationList() {
    const payload = {
      entityType: this.entityDetails.entityType,
      entityId: this.entityDetails._id
    }
    this.utils.startLoader();
    this.apiProvide.httpPost(AppConfigs.observationReports.solutionList, payload, success => {
      this.solutionList = success.data;
      this.utils.stopLoader();
    }, error => {
      this.utils.stopLoader();
    }, { baseUrl: "dhiti" })
  }

  goToReportsOfSolution(solutionId) {
    this.navCtrl.push(ObservationReportsPage,
      {
        "entityType": this.entityDetails.entityType,
        "entityId": this.entityDetails._id,
        "solutionId": solutionId,
        "immediateChildEntityType": this.entityDetails.immediateChildEntityType
      })
  }

  goToScoringReportOfSolution(solutionId) {
    const payload = {
      "entityType": this.entityDetails.entityType,
      "entityId": this.entityDetails._id,
      "solutionId": solutionId,
      "immediateChildEntityType": this.entityDetails.immediateChildEntityType
    }
    this.navCtrl.push('ReportsWithScorePage', payload);
  }

}
