import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppConfigs } from '../../../providers/appConfig';
import { LocalStorageProvider } from '../../../providers/local-storage/local-storage';
import { AssessmentServiceProvider } from '../../../providers/assessment-service/assessment-service';



@IonicPage()
@Component({
  selector: 'page-my-observation',
  templateUrl: 'my-observation.html',
})
export class MyObservationPage {

  programs: any;
  enableRefresh = AppConfigs.configuration.enableAssessmentListRefresh;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private localStorage: LocalStorageProvider,
    private assessmentService:AssessmentServiceProvider,
    ) {
  }

  ionViewDidLoad() {
    console.log("MY Observation page called");
    this.localStorage.getLocalStorage('observationList').then(data => { 
      if (data) {
        this.programs = data;
      } else {
        this.getAssessmentsApi();
      }
    }).catch(error => {
      this.getAssessmentsApi();
    })
  }

 
  
  getAssessmentsApi() {
    this.assessmentService.getAssessmentsApi ('observation').then(programs =>{
      this.programs = programs;
      //console.log("success in observations list api function");

    }).catch(error=>{
      //console.log("error in observations list api function");
    })
    

  }

  refresh(event?: any) {
   event ? this.assessmentService.refresh(this.programs ,'observation', event).then( program =>{
     this.programs = program;
     //console.log(program);
   }).catch( error=>{})
   : 
   this.assessmentService.refresh(this.programs,'observation').then(program =>{
    this.programs = program;
   }
   ).catch( error =>{

   });
  }


  getAssessmentDetails(event) {
    this.assessmentService.getAssessmentDetails(event,this.programs ,'observation').then(program=>{
    this.programs = program;
    }).catch(error=>{

    })
  }

  openMenu(event) {
    this.assessmentService.openMenu(event,this.programs , false);
  }
}
