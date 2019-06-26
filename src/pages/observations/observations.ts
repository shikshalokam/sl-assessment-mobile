import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Events } from 'ionic-angular';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { AssessmentServiceProvider } from '../../providers/assessment-service/assessment-service';
import { AppConfigs } from '../../providers/appConfig';
import { AddObservationFormPage } from './add-observation-form/add-observation-form';
import { ActionSheetController } from 'ionic-angular';
import { ObservationDetailsPage } from '../observation-details/observation-details';
import { ApiProvider } from '../../providers/api/api';
import { UtilsProvider } from '../../providers/utils/utils';


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
    public utils : UtilsProvider,
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
  
    this.localStorage.getLocalStorage('createdObservationList').then(data => {
      console.log("local storage createdObservationList");
      console.log(JSON.stringify(data))
      if (data) {
        this.createdObservation = data;

      } else {
        this.getCreatedObservation();
      }

    }).catch(error => {
      this.getCreatedObservation();

    })

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

  
  getCreatedObservation(){
    console.log("created oservation api called")
    this.apiProviders.httpGet(AppConfigs.cro.observationList,success=>{
      this.createdObservation = success.result;
      this.createdObservation.forEach(element => {
        if(element.entities.length >=0 ){
          element.entities.forEach(entity => {
            entity.downloaded = false;
          });
        }
      });
      console.log(JSON.stringify(this.createdObservation))
      this.localStorage.setLocalStorage('createdObservationList',this.createdObservation);
      },error=>{})
  }

  // navigateToDetails(index) {
  //   this.navCtrl.push(ObservationDetailsPage, {selectedObservationIndex: index , typeOfObservation : "observationList"})
  // }
  navigateToCreatedObservationDetails(index){
    this.navCtrl.push(ObservationDetailsPage, {selectedObservationIndex: index })

  }

  refresh(event?: any) {
      const url = AppConfigs.cro.observationList;
      // const url = AppConfigs.survey.fetchIndividualAssessments + "?type=assessment&subType=individual&status=active";
      event ? "" : this.utils.startLoader();
      this.apiProviders.httpGet(url, successData => {
        const downloadedAssessments = []
        const currentObservation = successData.result;
        for (const observation of this.createdObservation) {
          for (const entity of observation.entities) {
              if (entity.downloaded) {
                downloadedAssessments.push({
                  id: entity._id,
                  observationId : observation._id
                });
              }
            }
  
          }
  
        //console.log(JSON.stringify(downloadedAssessments))
  
        if (!downloadedAssessments.length) {
          this.createdObservation = successData.result;
          this.localStorage.setLocalStorage('createdObservationList', successData.result);
          event ? event.complete() : this.utils.stopLoader();
          
        } else {
          downloadedAssessments.forEach(element => {

          for (const observation of successData.result) {
            if(observation._id === element.observationId){
              for (const entity of observation.entities) {
                if (element.id === entity._id) {
                  entity.downloaded = true;
                }
              }
            }
            }
          });
          // programs = currentPrograms;
          this.localStorage.setLocalStorage('createdObservationList', successData.result);
          event ? event.complete() : this.utils.stopLoader();
          
        }
      }, error => {
      });
  
    
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
            // console.log("published obs")
            this.utils.openToast(success.message, "Ok");

            this.refresh();
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

