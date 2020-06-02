import { Component } from "@angular/core";
import { NavController, NavParams, Events } from "ionic-angular";
import { LocalStorageProvider } from "../../../providers/local-storage/local-storage";

/**
 * Generated class for the ProgramSolutionObservationDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: "page-program-solution-observation-detail",
  templateUrl: "program-solution-observation-detail.html",
})
export class ProgramSolutionObservationDetailPage {
  // programs: any;
  programIndex: any;
  solutionIndex: any;
  observationDetails: any[];
  observationList: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public localStorage: LocalStorageProvider,
    private events: Events
  ) {
    // this.events.subscribe("observationLocalstorageUpdated", (success) => {
    //   this.getLocalStorageData();
    // });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ProgramSolutionEntityPage");
    this.programIndex = this.navParams.get("programIndex");
    this.solutionIndex = this.navParams.get("solutionIndex"); //selectedObservationIndex
  }

  ionViewDidEnter() {
    this.getLocalStorageData();
  }

  getLocalStorageData() {
    this.observationDetails = [];
    this.localStorage
      .getLocalStorage("programList")
      .then((data) => {
        // this.programs = data;
        this.observationList = data[this.programIndex].solutions;
        /* this.observationDetails.push(
          data[this.programIndex].solutions[this.solutionIndex].observations
        ); */
        this.observationDetails =
          data[this.programIndex].solutions[this.solutionIndex].observations;
        console.log(this.observationDetails);
        // this.checkForAnySubmissionsMade();
        // this.enableCompleteBtn = this.isAllEntitysCompleted();
        // this.firstVisit = false;
      })
      .catch((error) => {
        // this.firstVisit = false;
      });
  }
}
