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
  // entity: any;
  assessmentType: any;
  programIndex: any;
  entityIndex: any;
  programList: any;
  entityList: any[];
  solutions: any;

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
    this.entityIndex = this.navParams.get("entityIndex");
    this.assessmentType = this.navParams.get("assessmentType");
    this.programIndex = this.navParams.get("programIndex");
    this.assessmentType === "institutional"
      ? this.getInstitutionalList()
      : this.getIndividualList();
  }

  getInstitutionalList() {
    this.localStorage
      .getLocalStorage("institutionalList")
      .then((programList) => {
        this.programList = programList;
        this.entityList = this.programList[this.programIndex]["entities"];
        this.solutions = this.entityList[this.entityIndex].solutions.length
          ? this.entityList[this.entityIndex].solutions
          : [];
      })
      .catch((err) => {});
  }

  getIndividualList() {
    this.localStorage
      .getLocalStorage("individualList")
      .then((programList) => {
        this.programList = programList;
        this.entityList = this.programList[this.programIndex]["entities"];
        this.solutions = this.entityList[this.entityIndex].solutions.length
          ? this.entityList[this.entityIndex].solutions
          : [];
      })
      .catch((err) => {});
  }

  getAssessmentDetails(k) {
    let event = {
      programIndex: this.programIndex,
      entityIndex: this.entityIndex,
      assessmentIndex: k,
    };

    event.programIndex = this.programIndex;
    this.assessmentService
      .getAssessmentDetailsV2(event, this.programList, this.assessmentType)
      .then((program) => {
        this.entityList =
          program[this.navParams.get("programIndex")]["entities"];
      })
      .catch((error) => {});
    // this.assessmentDetailsEvent.emit(event)
  }

  goToEcm(id, programName, ProgramId) {
    let submissionId = id;
    let heading = this.entityList[this.entityIndex].name;
    let recentlyUpdatedEntity = {
      programName: programName,
      ProgramId: ProgramId,
      EntityName: this.entityList[this.entityIndex].name,
      EntityId: this.entityList[this.entityIndex]._id,
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
    const solutionId = this.entityList[this.entityIndex].solutions[params[1]]
      ._id;
    const parentEntityId = this.entityList[this.entityIndex]._id;
    const createdByProgramId = this.programList[this.programIndex]._id;
    let event = {
      event: params[0],
      programIndex: this.programIndex,
      assessmentIndex: params[1],
      entityIndex: this.entityIndex,
      submissionId: params[2],
      solutionId: solutionId,
      parentEntityId: parentEntityId,
      createdByProgramId: createdByProgramId,
    };
    event.programIndex = this.programIndex;
    this.assessmentService.openMenuV2(event, this.programList, true);
  }
}
