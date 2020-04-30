import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { ImprovementProjectEntitySolutionPage } from "../improvement-project-entity-solution/improvement-project-entity-solution";

/**
 * Generated class for the ImprovementProjectEnityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: "page-improvement-project-entity",
  templateUrl: "improvement-project-entity.html",
})
export class ImprovementProjectEntityPage {
  programName: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.programName = this.navParams.get("heading");
  }
  programEntity = [
    {
      entityId: "5e3937f6c41ba34cd5686789",
      entityName: "Sri vivekananda school",
      entityType: "school",
      solutions: [
        {
          solutionId: "5e33d0efc41ba34cd568869d",
          solutionName: "NIQSA Self Assessment",
        },
        {
          solutionId: "5e33d0efc41ba34cd568869f",
          solutionName: "NIQSA Self Assessment - 2",
        },
      ],
    },
    {
      entityId: "5e3937f6c41ba34cd5688754",
      entityName: "NISA test school",
      entityType: "school",
      solutions: [
        {
          solutionId: "5e33d0efc41ba34cd568869d",
          solutionName: "NIQSA Self Assessment",
        },
      ],
    },
  ];
  ionViewDidLoad() {
    console.log("ionViewDidLoad ImprovementProjectEnityPage");
  }

  goToIpEntitySol(entityId, entityName) {
    this.navCtrl.push(ImprovementProjectEntitySolutionPage, {
      heading: entityName,
    });
  }
}
