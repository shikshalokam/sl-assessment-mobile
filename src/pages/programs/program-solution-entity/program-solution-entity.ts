import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { LocalStorageProvider } from "../../../providers/local-storage/local-storage";
import { AssessmentServiceProvider } from "../../../providers/assessment-service/assessment-service";

/**
 * Generated class for the ProgramSolutionEntityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: "page-program-solution-entity",
  templateUrl: "program-solution-entity.html",
})
export class ProgramSolutionEntityPage {
  program: any;
  solutionIndex: any;
  programIndex: any;
  programList: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private localStorage: LocalStorageProvider,
    public assessmentService: AssessmentServiceProvider
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad ProgramSolutionEntityPage");
    this.programIndex = this.navParams.get("programIndex");
    this.solutionIndex = this.navParams.get("solutionIndex");

    this.getProgramFromStorage();
  }

  getProgramFromStorage() {
    this.localStorage
      .getLocalStorage("programList")
      .then((data) => {
        if (data) {
          this.program = data[this.programIndex];
          this.programList = data;
        } else {
          this.program = null;
        }
      })
      .catch((error) => {
        this.program = null;
      });
  }

  getAssessmentDetails(entityIndex) {
    let event = {
      programIndex: this.programIndex,
      assessmentIndex: this.solutionIndex,
      entityIndex: entityIndex,
    };
    const assessmentType = this.programList[this.programIndex].solutions[
      this.solutionIndex
    ].subType;
    this.assessmentService
      .getAssessmentDetails(event, this.programList, assessmentType)
      .then((program) => {
        this.program = program[this.programIndex];
      })
      .catch((error) => {});
  }
}
