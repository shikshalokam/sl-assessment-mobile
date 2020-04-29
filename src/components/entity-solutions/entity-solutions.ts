import { Component } from "@angular/core";
import { NavParams, NavController } from "ionic-angular";
import { AssessmentServiceProvider } from "../../providers/assessment-service/assessment-service";
import { LocalStorageProvider } from "../../providers/local-storage/local-storage";
import { UtilsProvider } from "../../providers/utils/utils";
import { EvidenceProvider } from "../../providers/evidence/evidence";

/**
 * Generated class for the EntitySolutionsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: "entity-solutions",
  templateUrl: "entity-solutions.html",
})
export class EntitySolutionsComponent {
  text: string;
  entity: any;
  solutions: any;
  assessmentType: any;
  i: any;
  j: any;
  programType: any;
  programIndex: any;
  entityList: any[];
  programList: any;

  constructor(
    private navParams: NavParams,
    private assessmentService: AssessmentServiceProvider,
    private localStorage: LocalStorageProvider,
    private utils: UtilsProvider,
    public navCtrl: NavController,
    private evdnsServ: EvidenceProvider
  ) {
    console.log("Hello EntitySolutionsComponent Component");
    this.text = "Hello World";
    this.entity = this.navParams.get("entity");
    this.i = this.navParams.get("i");
    this.j = this.navParams.get("j");
    this.assessmentType = this.navParams.get("assessmentType");
    this.programType = this.navParams.get("programType");
    this.programIndex = this.navParams.get("programIndex");
    this.programList = this.navParams.get("programList");
    this.entityList = this.navParams.get("entityList");
    console.log(this.entity);
    this.solutions = this.entity.solutions.length ? this.entity.solutions : [];
  }

  getAssessmentDetails(k) {
    let event = {
      programIndex: this.i,
      assessmentIndex: k,
      entityIndex: this.j,
    };

    event.programIndex = this.programIndex;
    this.assessmentService
      .getAssessmentDetailsV2(event, this.programList, this.assessmentType)
      .then((program) => {
        this.entityList = [program[this.navParams.get("programIndex")]];
      })
      .catch((error) => {});
    // this.assessmentDetailsEvent.emit(event)
  }

  goToEcm(id, programName, ProgramId, EntityName, EntityId) {
    let submissionId = id;
    let heading = EntityName;
    let recentlyUpdatedEntity = {
      programName: programName,
      ProgramId: ProgramId,
      EntityName: this.entity.name,
      EntityId: this.entity._id,
      submissionId: id,
    };
    console.log("go to ecm called" + submissionId);

    this.localStorage
      .getLocalStorage(this.utils.getAssessmentLocalStorageKey(submissionId))
      .then((successData) => {
        console.log(JSON.stringify(successData));
        //console.log("go to ecm called");

        // successData = this.updateTracker.getLastModified(successData , submissionId)
        console.log("after modification");
        if (successData.assessment.evidences.length > 1) {
          this.navCtrl.push("EvidenceListPage", {
            _id: submissionId,
            name: heading,
            recentlyUpdatedEntity: recentlyUpdatedEntity,
          });
        } else {
          if (successData.assessment.evidences[0].startTime) {
            //console.log("if loop " + successData.assessment.evidences[0].externalId)
            this.utils.setCurrentimageFolderName(
              successData.assessment.evidences[0].externalId,
              submissionId
            );
            this.navCtrl.push("SectionListPage", {
              _id: submissionId,
              name: heading,
              selectedEvidence: 0,
              recentlyUpdatedEntity: recentlyUpdatedEntity,
            });
          } else {
            const assessment = {
              _id: submissionId,
              name: heading,
              recentlyUpdatedEntity: recentlyUpdatedEntity,
            };
            this.openAction(assessment, successData, 0);
            //console.log("else loop");
          }
        }
      })
      .catch((error) => {});
  }

  openAction(assessment, aseessmemtData, evidenceIndex) {
    this.utils.setCurrentimageFolderName(
      aseessmemtData.assessment.evidences[evidenceIndex].externalId,
      assessment._id
    );
    const options = {
      _id: assessment._id,
      name: assessment.name,
      recentlyUpdatedEntity: assessment.recentlyUpdatedEntity,
      selectedEvidence: evidenceIndex,
      entityDetails: aseessmemtData,
    };
    this.evdnsServ.openActionSheet(options);
  }

  openMenu(...params) {
    const solutionId = this.entityList[this.i].entities[this.j].solutions[
      params[1]
    ]._id;
    const parentEntityId = this.entityList[this.i].entities[this.j]._id;
    const createdByProgramId = this.entityList[this.i]._id;
    let event = {
      event: params[0],
      programIndex: this.i,
      assessmentIndex: params[1],
      entityIndex: this.j,
      submissionId: params[2],
      solutionId: solutionId,
      parentEntityId: parentEntityId,
      createdByProgramId: createdByProgramId,
    };
    event.programIndex = this.programIndex;
    this.assessmentService.openMenuV2(event, this.programList, true);
  }
}
