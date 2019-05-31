import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { MyObservationPage } from './my-observation/my-observation';
import { AddObservationPage } from './add-observation/add-observation';
import { DraftObservationPage } from './draft-observation/draft-observation';

/**
 * Generated class for the ObservationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-observations',
  templateUrl: 'observations.html',
})
export class ObservationsPage {

  myObservationPage = MyObservationPage;
  addObservationPage = AddObservationPage;
  draftObservationPage = DraftObservationPage;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    ) {
  }

  ionViewDidLoad() {
    console.log("observation Module loaded")
  }
 
}
