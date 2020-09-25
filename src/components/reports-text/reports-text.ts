import { Component, Input, OnInit } from "@angular/core";
import { SurveyProvider } from "../../pages/feedbacksurvey/provider/survey/survey";

/**
 * Generated class for the ReportsTextComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: "reports-text",
  templateUrl: "reports-text.html",
})
export class ReportsTextComponent {
  @Input() data;
  @Input() questionNumber;
  @Input() isFeedBackSurvey;
  @Input() solutionId;

  constructor(public surveyProvider: SurveyProvider) {
    console.log("Hello ReportsTextComponent Component");
  }

  getAllResponse() {
    let quesExternalId = this.data.order;
    this.surveyProvider
      .viewAllAns(quesExternalId,this.solutionId)
      .then((res) => {
        this.data.answer = res["result"];
      })
      .catch();
  }
}
