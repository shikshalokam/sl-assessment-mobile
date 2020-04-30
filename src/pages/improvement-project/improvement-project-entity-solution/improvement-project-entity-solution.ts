import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { SuggestedImprovementsPage } from "../suggested-improvements/suggested-improvements";

/**
 * Generated class for the ImprovementProjectEntitySolutionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: "page-improvement-project-entity-solution",
  templateUrl: "improvement-project-entity-solution.html",
})
export class ImprovementProjectEntitySolutionPage {
  programEntitySol = [
    {
      solutionId: "5e33d0efc41ba34cd568869d",
      solutionName: "NIQSA Self Assessment",
    },
    {
      solutionId: "5e33d0efc41ba34cd568869f",
      solutionName: "NIQSA Self Assessment - 2",
    },
  ];
  entityName: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.entityName = this.navParams.get("heading");
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ImprovementProjectEntitySolutionPage");
  }

  goToImpSugg() {
    this.navCtrl.push(SuggestedImprovementsPage);
  }
}
