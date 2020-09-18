import { Component } from "@angular/core";
import { NavParams } from "ionic-angular";

/**
 * Generated class for the SurveyMsgComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: "survey-msg",
  templateUrl: "survey-msg.html",
})
export class SurveyMsgComponent {
  text: string;

  options = {
    surveyCompleted: { img: "../../assets/imgs/submitted.svg", msg: "Your form is Submitted!" },
    surveyExpired: { img: "../../assets/imgs/survey-expired.svg", msg: "Sorry! the form has expired." },
  };
  option: any;

  constructor(public params: NavParams) {
    this.option = this.params.get("option");
  }

  get data(): any {
    return this.options[this.option];
  }
}
