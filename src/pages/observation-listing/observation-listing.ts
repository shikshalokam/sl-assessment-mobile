import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { AppConfigs } from '../../providers/appConfig';


@IonicPage()
@Component({
  selector: 'page-observation-listing',
  templateUrl: 'observation-listing.html',
})
export class ObservationListingPage {

  entityDetails;
  observationList;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private apiProvide: ApiProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ObservationListingPage');
    this.entityDetails = this.navParams.get('entity');
    // this.getObservationList();
    this.observationList = {
      "result": true,
      "data": [
        {
          "observationName": "School safety checklist",
          "observationId": "5d5cfff56fe163341eeb9787"
        }
      ]
    }
    console.log(JSON.stringify(this.entityDetails))
  }

  getObservationList() {
    const payload = {
      entityType: this.entityDetails.entityType,
      entityId: this.entityDetails._id
    }
    this.apiProvide.httpPost(AppConfigs.observationReports.observationList, payload, success => {
      console.log(JSON.stringify(success))
    }, error => {

    }, { "dhiti": true })
  }

  goToReportsOfObservation(observationId) {

  }

}
