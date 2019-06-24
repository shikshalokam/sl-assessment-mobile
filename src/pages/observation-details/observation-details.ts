import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { AssessmentServiceProvider } from '../../providers/assessment-service/assessment-service';

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
  typeOfObservation = 'observation'
  programs: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private assessmentService: AssessmentServiceProvider,
    private localStorage: LocalStorageProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ObservationDetailsPage');
    const selectedObservationIndex = this.navParams.get('selectedObservationIndex');
    const typeOfObservation = this.navParams.get('typeOfObservation')
    console.log(selectedObservationIndex)
    this.typeOfObservation = typeOfObservation === 'createdObservationList' ? 'createdObservationList' : 'observation'

    this.localStorage.getLocalStorage(typeOfObservation).then(data => {
      this.programs = data;
      // console.log(JSON.stringify(data))
      this.observationDetails.push(data[selectedObservationIndex]);
      console.log(JSON.stringify(this.observationDetails))

    }).catch(error => {
    })
  }

  markAsComplete() {
    
  }

  getAssessmentDetails(event) {
    event.assessmentIndex ? 
    this.assessmentService.getAssessmentDetails(event, this.programs, 'observation').then(program => {
      this.programs = program;
    }).catch(error => {

    })
    : 
    this.assessmentService.getAssessmentDetailsOfCreatedObservation(event, this.programs, 'bservation').then(program => {
      this.programs = program;
    }).catch(error => {

    })

  }
}
