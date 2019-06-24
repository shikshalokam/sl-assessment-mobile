import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { EvidenceProvider } from '../../providers/evidence/evidence';
import { UtilsProvider } from '../../providers/utils/utils';
import { EntityListPage } from '../../pages/observations/add-observation-form/entity-list/entity-list';
import { ApiProvider } from '../../providers/api/api';
import { AppConfigs } from '../../providers/appConfig';

/**
 * Generated class for the EntityListingComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'observation-entity-listing',
  templateUrl: 'observation-entity-listing.html'
})
export class ObservationEntityListingComponent {

  @Input() entityList;
  @Input() entityType;
  @Input() showMenu = true;
  // @Output() goToEcmEvent = new EventEmitter();
  @Output() getAssessmentDetailsEvent = new EventEmitter();
  @Output() openMenuEvent = new EventEmitter();
  @Input() typeOfObservation = 'observation';
  text: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private localStorage: LocalStorageProvider,
    private evdnsServ: EvidenceProvider,
    private apiProviders : ApiProvider,
    private modalCtrl : ModalController,
    private utils: UtilsProvider) {
  
    //console.log('Hello EntityListingComponent Component');
  }

  // goToEcm(id, name) {
  //   //console.log(JSON.stringify(id))
  //   this.goToEcmEvent.emit({
  //     submissionId: id,
  //     name: name
  //   })
  // }


  goToEcm(id, name) {
    //console.log("go to ecm called");
    let submissionId = id
    let heading = name;

    

    this.localStorage.getLocalStorage(this.utils.getAssessmentLocalStorageKey(submissionId)).then(successData => {
      
      // //console.log(JSON.stringify(successData));
    //console.log("go to ecm called");


      if (successData.assessment.evidences.length > 1) {

        this.navCtrl.push('EvidenceListPage', { _id: submissionId, name: heading })

      } else {
        if (successData.assessment.evidences[0].startTime) {
          //console.log("if loop " + successData.assessment.evidences[0].externalId)
          this.utils.setCurrentimageFolderName(successData.assessment.evidences[0].externalId, submissionId)
          this.navCtrl.push('SectionListPage', { _id: submissionId, name: heading, selectedEvidence: 0 })
        } else {

          const assessment = { _id: submissionId, name: heading }
          this.openAction(assessment, successData, 0);
          //console.log("else loop");

        }
      }
    }).catch(error => {
    });

  }
  openAction(assessment, aseessmemtData, evidenceIndex) {
    this.utils.setCurrentimageFolderName(aseessmemtData.assessment.evidences[evidenceIndex].externalId, assessment._id)
    const options = { _id: assessment._id, name: assessment.name, selectedEvidence: evidenceIndex, entityDetails: aseessmemtData };
    this.evdnsServ.openActionSheet(options);
  }


  getAssessmentDetails(programIndex, assessmentIndex, entityIndex) {
    this.getAssessmentDetailsEvent.emit({
      programIndex: programIndex,
      assessmentIndex: assessmentIndex,
      entityIndex: entityIndex
    });
  }
  getAssessmentDetailsOfCreatedObservation(programIndex,entityIndex){
    this.getAssessmentDetailsEvent.emit({
      programIndex: programIndex,
      entityIndex: entityIndex
    });
  }

  openMenu(...params) {
  
    const solutionId = this.entityList[params[1]].solutions[params[2]]._id;
    const parentEntityId = this.entityList[params[1]].solutions[params[2]].entities[params[3]]._id;
    const createdByProgramId = this.entityList[params[1]]._id;
    this.openMenuEvent.emit({
      event: params[0],
      programIndex: params[1],
      assessmentIndex: params[2],
      entityIndex: params[3],
      submissionId : params[4],
      solutionId :solutionId,
      parentEntityId : parentEntityId,
      createdByProgramId :createdByProgramId
    });

  }
  addEntity(...params){

   const  data = this.typeOfObservation === 'observation'? this.entityList[params[0]]._id : this.entityList[params[0]]._id 
   let entityListModal = this.modalCtrl.create(EntityListPage, { data :data }
      );
      entityListModal.onDidDismiss( entityList => {
        if(entityList) {
          console.log(JSON.stringify(entityList));
          let payload = {
            data:[]
          }
          entityList.forEach(element => {
            payload.data.push(element._id);
          });
          this.apiProviders.httpPost(AppConfigs.cro.mapEntityToObservation+this.entityList[params[0]]._id , payload , success =>{
            // console.log(JSON.stringify(this.entityList))
            this.entityList[0].entities = entityList;
            
          },error=>{

          })
        }
      })
    entityListModal.present();
    let updatedObservationList ;
   
  }
  removeEntity(...params){
    console.log("remove entity called")
    
    this.entityList[params[0]].entities.splice(params[1],1);
    console.log(JSON.stringify(this.entityList))
  }
}
