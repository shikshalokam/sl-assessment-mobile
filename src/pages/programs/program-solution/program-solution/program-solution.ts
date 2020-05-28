import { Component, Input } from "@angular/core";
import { ProgramSolutionEntityPage } from "../../program-solution-entity/program-solution-entity";
import { NavController } from "ionic-angular";
import { LocalStorageProvider } from "../../../../providers/local-storage/local-storage";
import { UtilsProvider } from "../../../../providers/utils/utils";

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
  constructor(public navCtrl: NavController) {
    console.log("Hello ProgramSolutionComponent Component");
  }

  goToProgramSolEntity() {
    this.navCtrl.push(ProgramSolutionEntityPage, {
      programIndex: this.programIndex,
      solutionIndex: this.solutionIndex,
    });
  }
}
