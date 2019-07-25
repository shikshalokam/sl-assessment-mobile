import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';

/**
 * Generated class for the SubmissionListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-submission-list',
  templateUrl: 'submission-list.html',
})
export class SubmissionListPage {
  observationDetails: any[];
  programs: any;
  enableCompleteBtn: any;
  selectedObservationIndex: any;
  entityIndex: any;
  observationIndex: any;
  submissionList: any;

  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
     private localStorage : LocalStorageProvider
     ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubmissionListPage');
    this. selectedObservationIndex = this.navParams.get('selectedObservationIndex');
    this. entityIndex = this.navParams.get('entityIndex');
    this. observationIndex = this.navParams.get('observationIndex');
    this.getLocalStorageData();
  }
  getLocalStorageData() {
    this.observationDetails = [];
    console.log("Getting data from local storage ")

    this.localStorage.getLocalStorage('createdObservationList').then(data => {
      this.programs = data;
      console.log(this.selectedObservationIndex +""+ this.entityIndex + ""+this.observationIndex)
      this.observationDetails.push(data[this.selectedObservationIndex]);
      // console.log(JSON.stringify(this.observationDetails[0]))
      this.submissionList = this.observationDetails[0].entities[this.entityIndex].submissions;
      console.log(JSON.stringify(this.submissionList))

    }).catch(error => {
    })
  }
  
}
