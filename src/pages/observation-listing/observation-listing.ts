import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { AppConfigs } from '../../providers/appConfig';
import { UtilsProvider } from '../../providers/utils/utils';
import { ObservationReportsPage } from '../observation-reports/observation-reports';

@IonicPage()
@Component({
  selector: 'page-observation-listing',
  templateUrl: 'observation-listing.html',
})
export class ObservationListingPage {

  entityDetails;
  observationList;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private utils: UtilsProvider,
    private apiProvide: ApiProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ObservationListingPage');
    this.entityDetails = this.navParams.get('entity');
    this.getObservationList();
  }

  getObservationList() {
    const payload = {
      entityType: this.entityDetails.entityType,
      entityId: this.entityDetails._id
    }
    this.utils.startLoader();
    this.apiProvide.httpPost(AppConfigs.observationReports.observationList, payload, success => {
      this.observationList = success.data;
      this.utils.stopLoader();
    }, error => {
      this.utils.stopLoader();
    }, { baseUrl: "dhiti" })
  }

  goToReportsOfObservation(observationId) {
    // this.utils.openToast("Coming soon")
    this.navCtrl.push(ObservationReportsPage,
      {
        "entityType": this.entityDetails.entityType,
        "entityId": this.entityDetails._id,
        "observationId": observationId,
        "immediateChildEntityType": this.entityDetails.immediateChildEntityType
      })
  }

}
