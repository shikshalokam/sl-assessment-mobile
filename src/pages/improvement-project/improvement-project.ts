import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { ImprovementProjectEntityPage } from "./improvement-project-entity/improvement-project-entity";

/**
 * Generated class for the ImprovementProjectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-improvement-project",
  templateUrl: "improvement-project.html",
})
export class ImprovementProjectPage {
  programList = [
    {
      programId: "5e33d0c44296d89fbde17456",
      programName: "NIQSA Self Assessment",
    },
  ];
  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad ImprovementProjectPage");
  }

  goToIpEntity(programId, programName) {
    this.navCtrl.push(ImprovementProjectEntityPage, { heading: programName });
  }
}
