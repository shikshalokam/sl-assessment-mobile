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
  programEntitySol: any;
  entityName: any;
  entityId: any;
  programId: any;
  entityType: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.entityName = this.navParams.get("heading");
    this.entityId = this.navParams.get("entityId");
    this.entityType = this.navParams.get("entityType");
    this.programId = this.navParams.get("programId");
    this.programEntitySol = this.navParams.get("solutions");
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ImprovementProjectEntitySolutionPage");
  }

  goToImpSugg(solId, solName) {
    this.navCtrl.push(SuggestedImprovementsPage, {
      heading: solName,
      solutionId: solId,
      entityId: this.entityId,
      entityType: this.entityType,
      programId: this.programId,
    });
  }
}
