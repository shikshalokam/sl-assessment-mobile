import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Events } from 'ionic-angular';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { AssessmentServiceProvider } from '../../providers/assessment-service/assessment-service';
import { AppConfigs } from '../../providers/appConfig';
import { AddObservationFormPage } from './add-observation-form/add-observation-form';
import { ActionSheetController } from 'ionic-angular';
import { ObservationDetailsPage } from '../observation-details/observation-details';
import { ApiProvider } from '../../providers/api/api';


@IonicPage()
@Component({
  selector: 'page-observations',
  templateUrl: 'observations.html',
})
export class ObservationsPage {


  selectedTab;
  draftObservation;
  createdObservation: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public app: App,
    private localStorage: LocalStorageProvider,
    private assessmentService: AssessmentServiceProvider,
    private apiProviders : ApiProvider,
    private events: Events,
    public actionSheetCtrl: ActionSheetController
  ) {
    this.events.subscribe('draftObservationArrayReload', () => {
      this.getDraftObservation();
    })
  }

  ionViewDidLoad() {
    this.selectedTab = 'active';
    console.log("observation Module loaded");
    this.localStorage.getLocalStorage('observationList').then(data => {
      if (data) {
        this.programs = data;
      } else {
        this.getAssessmentsApi();
      }
    }).catch(error => {
      this.getAssessmentsApi();
    })
    this.localStorage.getLocalStorage('createdObservationList').then(data => {
      console.log("local storage createdObservationList")
      if (data) {
        this.createdObservation = data;
      } else {
        this.getCreatedObservation();
      }
    }).catch(error => {
      this.getCreatedObservation();
    })
  

    // 
  }


  ionViewDidEnter() {
    this.getDraftObservation();
  }

  onTabChange(tabName) {
    this.selectedTab = tabName;
    if (tabName === 'draft') {
      this.getDraftObservation();
    }
  }


  programs: any;
  enableRefresh = AppConfigs.configuration.enableAssessmentListRefresh;

  getAssessmentsApi() {
    this.assessmentService.getAssessmentsApi('observation').then(programs => {
      this.programs = programs;
    }).catch(error => {
    })
  }
  getCreatedObservation(){
    console.log("created oservation api called")
    this.apiProviders.httpGet(AppConfigs.cro.observationList,success=>{
      this.createdObservation = success.result;
      this.localStorage.setLocalStorage('createdObservationList',this.createdObservation);
      },error=>{})
  }

  navigateToDetails(index) {
    this.navCtrl.push(ObservationDetailsPage, {selectedObservationIndex: index , typeOfObservation : "observationList"})
  }
  navigateToCreatedObservationDetails(index){
    this.navCtrl.push(ObservationDetailsPage, {selectedObservationIndex: index ,  typeOfObservation : "createdObservationList"})

  }

  refresh(event?: any) {
    event ? this.assessmentService.refresh(this.programs, 'observation', event).then(program => {
      this.programs = program;
      
    }).catch(error => { })
      :
      this.assessmentService.refresh(this.programs, 'observation').then(program => {
        this.programs = program;
      }
      ).catch(error => {

      });

      this.getCreatedObservation();
     
  }

  getDraftObservation() {
    this.localStorage.getLocalStorage('draftObservation').then(draftObs => {
      this.draftObservation = draftObs;
    }).catch(() => {
      this.draftObservation = [];
    })
  }

  addObservation() {
    this.app.getRootNav().push(AddObservationFormPage, {})
  }


  getAssessmentDetails(event) {
    this.assessmentService.getAssessmentDetails(event, this.programs, 'observation').then(program => {
      this.programs = program;
    }).catch(error => {

    })
  }

  openMenu(event) {
    this.assessmentService.openMenu(event, this.programs, false);
  }


  actionOnDraftObservation(index, observation) {
    let actionArray = [
      {
        text: 'Edit',
        role: 'edit',
        handler: () => {
          console.log('edit clicked');
          this.app.getRootNav().push(AddObservationFormPage, { data: observation, index: index })
        }
      }, {
        text: 'Delete',
        handler: () => {
          this.draftObservation.splice(index, 1);
          this.localStorage.setLocalStorage('draftObservation', this.draftObservation);
        }
      }
    ];
    if (observation.data.isComplete) {
      actionArray.push({
        text: 'Publish',
        role: 'Publish',
        handler: () => {
          let obj : {} = {
            data:{}
          };
          console.log(JSON.stringify(observation))
          obj['data'].status = 'published';
          obj['data'].startDate = observation.data.startDate;
          obj['data'].endDate = observation.data.endDate;
          obj['data'].name = observation.data.name;
          obj['data'].description =observation.data.description ;
          console.log(JSON.stringify(obj));


          // observation.data.status = 'published';

          this.apiProviders.httpPost(AppConfigs.cro.createObservation+observation.data.solutionId ,obj, success =>{
            console.log(JSON.stringify(success));
            console.log("published obs")
          },error =>{

          })
          // let publishObservation = observation;
          this.draftObservation.splice(index, 1);
          this.localStorage.setLocalStorage('draftObservation', this.draftObservation);
        }
      })
    }
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Choose a Action',
      buttons: actionArray
    });
    actionSheet.present();
  }
}

