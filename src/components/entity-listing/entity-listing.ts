import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { EvidenceProvider } from '../../providers/evidence/evidence';
import { UtilsProvider } from '../../providers/utils/utils';

/**
 * Generated class for the EntityListingComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'entity-listing',
  templateUrl: 'entity-listing.html'
})
export class EntityListingComponent {

  @Input() entityList;
  @Input() entityType;
  @Input() showMenu = true;
  // @Output() goToEcmEvent = new EventEmitter();
  @Output() getAssessmentDetailsEvent = new EventEmitter();
  @Output() openMenuEvent = new EventEmitter();

  text: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private localStorage: LocalStorageProvider,
    private evdnsServ: EvidenceProvider,
    private utils: UtilsProvider) {
  
    console.log('Hello EntityListingComponent Component');
  }

  // goToEcm(id, name) {
  //   console.log(JSON.stringify(id))
  //   this.goToEcmEvent.emit({
  //     submissionId: id,
  //     name: name
  //   })
  // }


  goToEcm(id, name) {
    console.log("go to ecm called");
    let submissionId = id
    let heading = name;

    

    this.localStorage.getLocalStorage(this.utils.getAssessmentLocalStorageKey(submissionId)).then(successData => {
      
      // console.log(JSON.stringify(successData));
    console.log("go to ecm called");


      if (successData.assessment.evidences.length > 1) {

        this.navCtrl.push('EvidenceListPage', { _id: submissionId, name: heading })

      } else {
        if (successData.assessment.evidences[0].startTime) {
          console.log("if loop " + successData.assessment.evidences[0].externalId)
          this.utils.setCurrentimageFolderName(successData.assessment.evidences[0].externalId, submissionId)
          this.navCtrl.push('SectionListPage', { _id: submissionId, name: heading, selectedEvidence: 0 })
        } else {

          const assessment = { _id: submissionId, name: heading }
          this.openAction(assessment, successData, 0);
          console.log("else loop");

        }
      }
    }).catch(error => {
    });

  }
  openAction(assessment, aseessmemtData, evidenceIndex) {
    console.log(JSON.stringify(aseessmemtData));
    // console.log("open action");

    // console.log(aseessmemtData.solutions[0].evidences[evidenceIndex].externalId);
    // console.log(JSON.stringify(aseessmemtData.solutions[0].evidences[evidenceIndex].externalId))
    // console.log(JSON.stringify(aseessmemtData))
    this.utils.setCurrentimageFolderName(aseessmemtData.assessment.evidences[evidenceIndex].externalId, assessment._id)
    // console.log("open action");

    const options = { _id: assessment._id, name: assessment.name, selectedEvidence: evidenceIndex, entityDetails: aseessmemtData };
    // console.log(JSON.stringify(options))
    this.evdnsServ.openActionSheet(options);
  }


  getAssessmentDetails(programIndex, assessmentIndex, entityIndex) {
    this.getAssessmentDetailsEvent.emit({
      programIndex: programIndex,
      assessmentIndex: assessmentIndex,
      entityIndex: entityIndex
    })
  }

  openMenu(event, programIndex, assessmentIndex, entityIndex) {
    console.log("emitting called open menu")
    this.openMenuEvent.emit({
      event: event,
      programIndex: programIndex,
      assessmentIndex: assessmentIndex,
      entityIndex: entityIndex
    })
  }
}
