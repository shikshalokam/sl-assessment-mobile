import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';

/**
 * Generated class for the ObservationDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-observation-details',
  templateUrl: 'observation-details.html',
})
export class ObservationDetailsPage {

  observationDetails = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private localStorage: LocalStorageProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ObservationDetailsPage');
    const selectedObservationIndex = this.navParams.get('selectedObservationIndex');
    console.log(selectedObservationIndex)
    this.localStorage.getLocalStorage('observationList').then(data => {
      console.log(JSON.stringify(data))
      this.observationDetails.push(data[selectedObservationIndex]);
    }).catch(error => {
    })
  }

  markAsComplete() {
    
  }

}
