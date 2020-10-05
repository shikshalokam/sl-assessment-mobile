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
  completedDate: any; // for pagination purpose in survey answers if more then 10 ans

  constructor(public surveyProvider: SurveyProvider) {
    console.log("Hello ReportsTextComponent Component");
  }

  getAllResponse() {
    let quesExternalId = this.data.order;
    let completedDate = this.completedDate;
    let solutionId = this.solutionId;
    let Obj = { quesExternalId, completedDate, solutionId };
    this.surveyProvider
      .viewAllAns(Obj)
      .then((res) => {
        this.data.answer = [...this.data.answer, ...res["result"].answers];
        this.completedDate = res["result"].completedDate;
      })
      .catch();
  }
}
