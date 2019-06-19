import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { AssessmentServiceProvider } from '../../providers/assessment-service/assessment-service';
import { AppConfigs } from '../../providers/appConfig';
// import { AddObservationFormPage } from './add-observation-form/add-observation-form';

// import { ViewObservationPage } from './view-observation/view-observation';
// import { MyObservationPage } from './my-observation/my-observation';
// import { DraftObservationPage } from './draft-observation/draft-observation';

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

  // viewObservationPage = ViewObservationPage;
  // myObservationPage = MyObservationPage;
  // draftObservationPage = DraftObservationPage;

  selectedTab;
  draftObservation;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private localStorage: LocalStorageProvider,
    private assessmentService:AssessmentServiceProvider,
    ) {
  }

  ionViewDidLoad() {
    this.selectedTab = 'active';
    console.log("observation Module loaded");
    this.getDraftObservation();
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



  onTabChange(tabName) {
    this.selectedTab = tabName;
  }


  programs: any;
  enableRefresh = AppConfigs.configuration.enableAssessmentListRefresh;
  
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

  getDraftObservation() {
    this.localStorage.getLocalStorage('draftObservation').then(draftObs => {
      this.draftObservation = draftObs;
      console.log(JSON.stringify(draftObs))
    }).catch(() => {
      this.draftObservation = [];
    })
  }

  addObservation(){
    this.navCtrl.push('AddObservationFormPage', {})
    
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
