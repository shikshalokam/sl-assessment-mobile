import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { ObservationDetailsPage } from '../observation-details/observation-details';

/**
 * Generated class for the AssessmentAboutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-assessment-about',
  templateUrl: 'assessment-about.html',
})
export class AssessmentAboutPage {
  data ;
  type;
  index;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private localStorage: LocalStorageProvider,
     
     ) {
   this.index =  this.navParams.get('index');
   this.type = this.navParams.get('type')
   console.log(JSON.stringify(this.type))
   console.log(JSON.stringify(this.index))

  }

  ionViewDidLoad() {
    this.localStorage.getLocalStorage(this.type).then( success => {
    this.data = success[this.index]
    console.log(JSON.stringify(success[this.index]))
    }).catch(error => {

    });
    console.log('ionViewDidLoad AssessmentAboutPage');
  }
  goToEntity(){
    this.navCtrl.push(ObservationDetailsPage, { selectedObservationIndex: this.index })
  }
}
