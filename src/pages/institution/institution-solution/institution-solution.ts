import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { LocalStorageProvider } from "../../../providers/local-storage/local-storage";
import { UtilsProvider } from "../../../providers/utils/utils";
import { EvidenceProvider } from "../../../providers/evidence/evidence";
import { InstitutionServiceProvider } from "../institution-service";
import { storageKeys } from "../../../providers/storageKeys";
import { ProgramSolutionObservationDetailPage } from "../../programs/program-solution-observation-detail/program-solution-observation-detail";
import { ProgramObservationSubmissionPage } from "../../programs/program-observation-submission/program-observation-submission";
import { ProgramServiceProvider } from "../../programs/program-service";

/**
 * Generated class for the InstitutionSolutionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: "page-institution-solution",
  templateUrl: "institution-solution.html",
})
export class InstitutionSolutionPage {
  entity: any;
  entityType: any;
  entityIndex: any;
  institutionList: any;
  submissionArr: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public localStorage: LocalStorageProvider,
    public utils: UtilsProvider,
    public evdnsServ: EvidenceProvider,
    public institutionService: InstitutionServiceProvider,
    public programService: ProgramServiceProvider
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad InstitutionSolutionPage");
    let navData = this.navParams.get("navData");
    this.entityType = navData.entityType;
    this.entityIndex = navData.entityIndex;
    this.getInstituionFromStorage();
  }

  getInstituionFromStorage() {
    this.utils.startLoader();
    this.institutionService
      .getInstituionFromStorage()
      .then((institutions) => {
        this.institutionList = institutions;
        this.entity = this.institutionList.entities[this.entityType][
          this.entityIndex
        ];
        this.getSubmissionArr();
        this.utils.stopLoader();
      })
      .catch((error) => {
        this.entity = null;
        this.utils.stopLoader();
      });
  }

  getSubmissionArr() {
    this.localStorage
      .getLocalStorage(storageKeys.submissionIdArray)
      .then((allId) => {
        this.submissionArr = allId;
        this.applySubmission();
      })
      .catch((err) => {});
  }

  applySubmission() {
    let entityId = this.institutionList.entities[this.entityType][
      this.entityIndex
    ]._id;

    this.institutionList.entities[this.entityType][
      this.entityIndex
    ].solutions.map((sol, solutionIndex) => {
      this.submissionArr.includes(sol.submissionId)
        ? (sol.downloaded = true)
        : null;
    });
  }

  goToEcm(solutionIndex, submissionId) {
    // let submissionId = id;
    let heading = this.institutionList.entities[this.entityType][
      this.entityIndex
    ].name;
    let recentlyUpdatedEntity = {
      programName: this.institutionList.entities[this.entityType][
        this.entityIndex
      ].solutions[solutionIndex].programName,
      ProgramId: this.institutionList.entities[this.entityType][
        this.entityIndex
      ].solutions[solutionIndex].programId,
      EntityName: this.institutionList.entities[this.entityType][
        this.entityIndex
      ].name,
      EntityId: this.institutionList.entities[this.entityType][this.entityIndex]
        ._id,
      submissionId: submissionId,
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

  getAssessmentDetails(solutionIndex) {
    let event = {
      // programIndex: this.programIndex,
      // assessmentIndex: this.solutionIndex,
      entityIndex: this.entityIndex,
      entityType: this.entityType,
      solutionIndex: solutionIndex,
    };

    this.institutionService
      .getAssessmentDetails(event, this.institutionList)
      .then((institutions) => {
        this.getInstituionFromStorage();
      })
      .catch((error) => {});
  }

  /* goToObservationDetails(programId, observationId) {
    let EntityId = this.institutionList.entities[this.entityType][
      this.entityIndex
    ]._id;

    this.localStorage
      .getLocalStorage(storageKeys.programList)
      .then((programs) => {
        let programIndex = programs.map((p) => p._id).indexOf(programId);
        let solutionIndex = programs[programIndex].solutions
          .map((s) => s._id)
          .indexOf(observationId);
        let entityIndex = programs[programIndex].solutions[
          solutionIndex
        ].entities
          .map((e) => e._id)
          .indexOf(EntityId);
        console.log(programIndex);
        console.log(solutionIndex);
        console.log(entityIndex);
        this.navCtrl.push(ProgramSolutionObservationDetailPage, {
          programIndex: programIndex,
          solutionIndex: solutionIndex,
        });
      })
      .catch((err) => {});
  }
 */
  goToObservationSubmission(programId, observationId) {
    let EntityId = this.institutionList.entities[this.entityType][
      this.entityIndex
    ]._id;

    this.localStorage
      .getLocalStorage(storageKeys.programList)
      .then((programs) => {
        let programIndex = programs.map((p) => p._id).indexOf(programId);
        let solutionIndex = programs[programIndex].solutions
          .map((s) => s._id)
          .indexOf(observationId);
        let entityIndex = programs[programIndex].solutions[
          solutionIndex
        ].entities
          .map((e) => e._id)
          .indexOf(EntityId);

        let data = {
          programIndex: programIndex,
          solutionIndex: solutionIndex,
          entityIndex: entityIndex,
        };
        if (
          programs[programIndex].solutions[solutionIndex].entities[entityIndex]
            .submissions &&
          programs[programIndex].solutions[solutionIndex].entities[entityIndex]
            .submissions.length
        ) {
          this.navCtrl.push(ProgramObservationSubmissionPage, { data });
        } else {
          let event = {
            programIndex: programIndex,
            solutionIndex: solutionIndex,
            entityIndex: entityIndex,
            submission: {
              submissionNumber: 1,
              observationId:
                programs[programIndex].solutions[solutionIndex]._id,
            },
          };

          this.programService
            .getAssessmentDetailsForObservation(event, programs)
            .then(async (programs) => {
              await this.programService.refreshObservationList();
              this.navCtrl.push(ProgramObservationSubmissionPage, { data });
            });
        }
      })
      .catch((err) => {});
  }
}
