import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { LocalStorageProvider } from "../../../providers/local-storage/local-storage";
import { ProgramSolutionEntityPage } from "../program-solution-entity/program-solution-entity";

/**
 * Generated class for the ProgramSolutionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: "page-program-solution",
  templateUrl: "program-solution.html",
})
export class ProgramSolutionPage {
  programIndex: any;
  program: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private localStorage: LocalStorageProvider
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad ProgramSolutionPage");
    this.programIndex = this.navParams.get("programIndex");
    this.getProgramFromStorage();
  }

  getProgramFromStorage() {
    this.localStorage
      .getLocalStorage("programList")
      .then((data) => {
        if (data) {
          this.program = data[this.programIndex];
        } else {
          this.program = null;
        }
      })
      .catch((error) => {
        this.program = null;
      });
  }

  goToProgramSolEntity(solutionIndex) {
    this.navCtrl.push(ProgramSolutionEntityPage, {
      programIndex: this.programIndex,
      solutionIndex: solutionIndex,
    });
  }
}
