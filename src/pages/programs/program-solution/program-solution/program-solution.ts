import { Component, Input } from "@angular/core";
import { ProgramSolutionEntityPage } from "../../program-solution-entity/program-solution-entity";
import { NavController, App } from "ionic-angular";
import { ProgramSolutionObservationDetailPage } from "../../program-solution-observation-detail/program-solution-observation-detail";
import { storageKeys } from "../../../../providers/storageKeys";
import { LocalStorageProvider } from "../../../../providers/local-storage/local-storage";
import { UtilsProvider } from "../../../../providers/utils/utils";
import { QuestionerPage } from "../../../questioner/questioner";
import { SurveyProvider } from "../../../feedbacksurvey/provider/survey/survey";

/**
 * Generated class for the ProgramSolutionComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: "program-solution",
  templateUrl: "program-solution.html",
})
export class ProgramSolutionComponent {
  @Input("solutionMeta") solution: any;
  @Input("programIndex") programIndex: any;
  @Input("solutionIndex") solutionIndex: any;
  @Input("showProgram") showProgram: boolean;
  @Input("programList") programList: any;
  program: any;
  submissionArr: any;
  constructor(
    public navCtrl: NavController,
    public app: App,
    public localStorage: LocalStorageProvider,
    public utils: UtilsProvider,
    public surveyProvider: SurveyProvider
  ) {
    this.getSubmissionArr();
  }

  //Redirect on solution click based on sol type,observation individual or institutional

  redirectOnSoluctionClick() {
    if (this.solution.type == "survey") {
      this.goTosurvey();
      return;
    }
    this.solution.type == "observation" ? this.goToProgSolObservationDetails() : this.goToProgramSolEntity();
  }

  goToProgramSolEntity() {
    this.navCtrl.push(ProgramSolutionEntityPage, {
      programIndex: this.programIndex,
      solutionIndex: this.solutionIndex,
    });
  }

  goToProgSolObservationDetails() {
    this.navCtrl.push(ProgramSolutionObservationDetailPage, {
      programIndex: this.programIndex,
      solutionIndex: this.solutionIndex,
    });
  }

  // for survey story
  getSubmissionArr(): void {
    this.localStorage
      .getLocalStorage(storageKeys.submissionIdArray)
      .then((allId) => {
        this.submissionArr = allId;
      })
      .catch(() => {
        this.submissionArr = [];
      });
  }

  goTosurvey() {
    console.log(this.solution);
    if (this.solution.entities && this.solution.entities.length) {
      const submission = this.solution.entities[0].submissions[0];
      const t1 = new Date();
      const t2 = new Date(submission.endDate);
      if (t1 > t2) {
        this.utils.openToast("Survey expired");
        return;
      }
      if (submission.status == "completed") {
        this.utils.openToast("Survey already submitted");
        return;
      }
      this.submissionArr.includes(submission.submissionsId)
        ? this.goToQuestionPage(submission.submissionsId)
        : this.downloadSurvey(submission);
    }
  }

  goToQuestionPage(submissionId) {
    const navParams = { _id: submissionId, selectedEvidence: 0, selectedSection: 0 };
    this.navCtrl.push(QuestionerPage, navParams);
  }

  downloadSurvey(submission) {
    if (!submission.surveyId) {
      return;
    }
    this.surveyProvider
      .getDetailsById(submission.surveyId)
      .then((res) => {
        const survey = res.result;
        this.storeRedirect(survey);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  storeRedirect(survey: any): void {
    this.surveyProvider
      .storeSurvey(survey.assessment.submissionId, survey)
      .then((survey) => this.goToQuestionPage(survey.assessment.submissionId));
  }

  /*
  remove survey solution from home page if expired one, other solution can be shown.
  in program solution page that survey solution should be visible.
*/
  get showSurvey(): boolean {
    if (this.solution.type != "survey") {
      return true;
    }

    if (this.solution.entities && this.solution.entities.length) {
      const submission = this.solution.entities[0].submissions[0];
      const t1 = new Date();
      const t2 = new Date(submission.endDate);
      if (t1 > t2) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
}
