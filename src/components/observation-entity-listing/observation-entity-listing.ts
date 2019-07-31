import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController, Events } from 'ionic-angular';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { EvidenceProvider } from '../../providers/evidence/evidence';
import { UtilsProvider } from '../../providers/utils/utils';
import { EntityListPage } from '../../pages/observations/add-observation-form/entity-list/entity-list';
import { ApiProvider } from '../../providers/api/api';
import { AppConfigs } from '../../providers/appConfig';
import { TranslateService } from '@ngx-translate/core';
import { AssessmentAboutPage } from '../../pages/assessment-about/assessment-about';
import { SubmissionListPage } from '../../pages/submission-list/submission-list';
import { ObservationServiceProvider } from '../../providers/observation-service/observation-service';
// import { AssessmentAboutPage } from '../../pages/assessment-about/assessment-about';
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
  @Output() getAssessmentDetailsEvent = new EventEmitter();
  @Output() openMenuEvent = new EventEmitter();
  @Input() selectedObservationIndex;
  @Input() observationList;


  text: string;
  // @Input() selectedindex ;
  @Output() updatedLocalStorage = new EventEmitter();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public observationProvider: ObservationServiceProvider,
    private localStorage: LocalStorageProvider,
    public alertCntrl: AlertController,
    private evdnsServ: EvidenceProvider,
    private translate: TranslateService,
    private apiProviders: ApiProvider,
    private events: Events,
    private modalCtrl: ModalController,
    private utils: UtilsProvider) {
    console.log(JSON.stringify(this.entityList))

    //console.log('Hello EntityListingComponent Component');
  }

  // goToEcm(id, name) {
  //   //console.log(JSON.stringify(id))
  //   this.goToEcmEvent.emit({
  //     submissionId: id,
  //     name: name
  //   })
  // }
  checkSubmission(entity, observationIndex, entityindex) {
    console.log(JSON.stringify(this.entityList))
    console.log("checking submission");

    if (this.entityList[observationIndex]['entities'][entityindex].submissions && this.entityList[observationIndex]['entities'][entityindex].submissions.length > 0) {
      console.log("submission there")
      this.navCtrl.push(SubmissionListPage, { observationIndex: observationIndex, entityIndex: entityindex, selectedObservationIndex: this.selectedObservationIndex })
    } else {
      console.log("no submission")
      this.observationProvider.getSubmission(this.selectedObservationIndex ,entityindex, 1 , this.observationList,'createdObservationList').then(submissionId => {
        this.goToEcm( entity.name, entityindex, observationIndex , submissionId) 
      }).catch(error => {

      });
    }
  }

  goToEcm( name, entityindex, observationIndex ,submissionId) {
    // console.log("go to ecm called");
    let heading = name;
    // this.observationProvider.getSubmission(this.selectedObservationIndex ,entityindex, 1 , this.observationList,'createdObservationList').then(success => {
    // //   console.log(JSON.stringify(success));
    // this.localStorage.getLocalStorage('createdObservationList').then(success => {  
      // console.log(JSON.stringify(success[observationIndex]))  
      // console.log(success[observationIndex].entities[entityindex])
      // let submissionId = success[observationIndex].entities[entityindex].submissionId;
      this.localStorage.getLocalStorage(this.utils.getAssessmentLocalStorageKey(submissionId)).then(successData => {
        // console.log(JSON.stringify(successData));
        // this.navCtrl.push(AssessmentAboutPage, { data: successData });
        console.log("go to ecm called");
  
  
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
  
      }).catch();
    // }).catch(error => {

    // })
   

    //   this.localStorage.getLocalStorage(this.utils.getAssessmentLocalStorageKey(submissionId)).then(successData => {

    // // console.log(JSON.stringify(successData));
    // // this.navCtrl.push(AssessmentAboutPage, {data : successData});

    //   // //console.log("go to ecm called");


    //     if (successData.assessment.evidences.length > 1) {

    //       this.navCtrl.push('EvidenceListPage', { _id: submissionId, name: heading })

    //     } else {

    //       if (successData.assessment.evidences[0].startTime) {
    //         //console.log("if loop " + successData.assessment.evidences[0].externalId)
    //         this.utils.setCurrentimageFolderName(successData.assessment.evidences[0].externalId, submissionId)
    //         this.navCtrl.push('SectionListPage', { _id: submissionId, name: heading, selectedEvidence: 0 })
    //       } else {

    //         const assessment = { _id: submissionId, name: heading }
    //         this.openAction(assessment, successData, 0);
    //         //console.log("else loop");

    //       }
    //     }
    //   }).catch(error => {
    //   });
    // }

  }
  openAction(assessment, aseessmemtData, evidenceIndex) {
    this.utils.setCurrentimageFolderName(aseessmemtData.assessment.evidences[evidenceIndex].externalId, assessment._id)
    const options = { _id: assessment._id, name: assessment.name, selectedEvidence: evidenceIndex, entityDetails: aseessmemtData };
    this.evdnsServ.openActionSheet(options, 'Observation');
  }



  getAssessmentDetailsOfCreatedObservation(programIndex, entityIndex, solutionId) {
    console.log("go to details called");

    this.getAssessmentDetailsEvent.emit({
      programIndex: programIndex,
      entityIndex: entityIndex,
      solutionId: solutionId
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
      submissionId: params[4],
      solutionId: solutionId,
      parentEntityId: parentEntityId,
      createdByProgramId: createdByProgramId
    });

  }

  addEntity(...params) {
    console.log(JSON.stringify(params))

    let entityListModal = this.modalCtrl.create(EntityListPage, { data: this.entityList[params[0]]._id }
    );
    entityListModal.onDidDismiss(entityList => {
      if (entityList) {
        console.log(JSON.stringify(entityList));
        let payload = {
          data: []
        }
        entityList.forEach(element => {
          payload.data.push(element._id);
        });
        // this.utils.startLoader();
        this.apiProviders.httpPost(AppConfigs.cro.mapEntityToObservation + this.entityList[params[0]]._id, payload, success => {
          // this.utils.stopLoader();

          // entityList.forEach(entity => {
          //   entity.submissionStatus = "started";
          //   entity.downloaded = false;
          // })
          // this.entityList[0].entities = [...entityList, ...this.entityList[0].entities];
          // this.updatedLocalStorage.emit();
          this.events.publish('refreshObservationList','added');


        }, error => {
          this.utils.stopLoader();
        })
      }
    })
    entityListModal.present();
  }

  removeEntity(...params) {
    console.log("remove entity called")
    let translateObject;
    this.translate.get(['actionSheet.confirm', 'actionSheet.deleteEntity', 'actionSheet.no', 'actionSheet.yes']).subscribe(translations => {
      translateObject = translations;
      console.log(JSON.stringify(translations))
    })
    let alert = this.alertCntrl.create({
      title: translateObject['actionSheet.confirm'],
      message: translateObject['actionSheet.deleteEntity'],
      buttons: [
        {
          text: translateObject['actionSheet.no'],
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: translateObject['actionSheet.yes'],
          handler: () => {
            let obj = {
              data: [
                this.entityList[params[0]].entities[params[1]]._id
              ]
            }
            this.utils.startLoader();
            this.apiProviders.httpPost(AppConfigs.cro.unMapEntityToObservation + this.entityList[params[0]]._id, obj, success => {
              let okMessage;
              this.translate.get('toastMessage.ok').subscribe(translations => {
                //  console.log(JSON.stringify(translations))

                okMessage = translations
              })
              this.utils.openToast(success.message, okMessage);

              this.utils.stopLoader();
              console.log(JSON.stringify(success));

              this.entityList[params[0]].entities.splice(params[1], 1);
              this.updatedLocalStorage.emit(params[1]);
            }, error => {
              this.utils.stopLoader();

              console.log(JSON.stringify(error));
              console.log("error")

            });
            console.log(JSON.stringify(this.entityList))
          }
        }
      ]
    });
    alert.present();
  }



}
