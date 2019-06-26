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
  programs: any;
  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private assessmentService: AssessmentServiceProvider,
    private localStorage: LocalStorageProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ObservationDetailsPage');
    const selectedObservationIndex = this.navParams.get('selectedObservationIndex');
    console.log(selectedObservationIndex)
    this.localStorage.getLocalStorage('createdObservationList').then(data => {
      this.programs = data;
      console.log(JSON.stringify(data))
      this.observationDetails.push(data[selectedObservationIndex]);
      console.log(JSON.stringify(this.observationDetails))

    }).catch(error => {
    })
  }

  markAsComplete() {
    
  }

  getAssessmentDetails(event) {
    // console.log(JSON.stringify(event))
    event.assessmentIndex ? 
    this.assessmentService.getAssessmentDetails(event, this.programs, 'observation').then(program => {
      this.programs = program;
    }).catch(error => {

    })
    : 
    console.log(JSON.stringify(this.programs));
    console.log("TEST")
    event.observationIndex = this.navParams.get('selectedObservationIndex');
    this.assessmentService.getAssessmentDetailsOfCreatedObservation(event, this.programs, 'createdObservationList').then(program => {
      this.programs = program;
      
    }).catch(error => {

    })

    

  }
  updateLocalStorage(event){
      console.log("local storge called")

      this.localStorage.getLocalStorage('createdObservationList').then(data =>{
            console.log(JSON.stringify(data[this.navParams.get('selectedObservationIndex')]))
            console.log("success data")
            event.length ? 
            data[this.navParams.get('selectedObservationIndex')].entities = event
            : 
            data[this.navParams.get('selectedObservationIndex')].entities.splice(event,1);


            this.localStorage.setLocalStorage('createdObservationList',data);
          }).catch(error =>{

          });
  }


}
