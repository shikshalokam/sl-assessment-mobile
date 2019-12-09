import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppConfigs } from '../../providers/appConfig';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { AssessmentServiceProvider } from '../../providers/assessment-service/assessment-service';

// @IonicPage()
@Component({
  selector: 'page-individual-listing',
  templateUrl: 'individual-listing.html',
})
export class IndividualListingPage {
  assessmentlocalStorageName = "individualList"
  programs: any;
  enableRefresh = AppConfigs.configuration.enableAssessmentListRefresh;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private localStorage: LocalStorageProvider,
    private assessmentService :AssessmentServiceProvider,
    ) {
  }

  ionViewDidLoad() {
    this.localStorage.getLocalStorage('individualList').then(data => {
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
    this.assessmentService.getAssessmentsApi ('individual').then(programs =>{
      this.programs = programs;
      console.log("success in individual list api function");

    }).catch(error=>{
      console.log("error in individual list api function");
    })
    

  }

  refresh(event?: any) {
   event ? this.assessmentService.refresh(this.programs ,'individual', event).then( program =>{
     this.programs = program;
   }).catch( error=>{})
   : 
   this.assessmentService.refresh(this.programs,'individual').then(program =>{
    this.programs = program;
   }
   ).catch( error =>{

   });
  }


  getAssessmentDetails(event) {
    this.assessmentService.getAssessmentDetails(event,this.programs ,'individual').then(program=>{
    this.programs = program;
    }).catch(error=>{

    })
  }

  openMenu(event) {
    this.assessmentService.openMenu(event,this.programs,true);
  }


 
}
