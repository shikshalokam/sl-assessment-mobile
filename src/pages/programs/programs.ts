import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { ApiProvider } from "../../providers/api/api";
import { UtilsProvider } from "../../providers/utils/utils";
import { AppConfigs } from "../../providers/appConfig";
import { LocalStorageProvider } from "../../providers/local-storage/local-storage";
import { ProgramServiceProvider } from "./program-service";
import { ProgramSolutionPage } from "./program-solution/program-solution";

/**
 * Generated class for the ProgramsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-programs",
  templateUrl: "programs.html",
})
export class ProgramsPage {
  programList: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private localStorage: LocalStorageProvider,
    private programService: ProgramServiceProvider
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad ProgramsPage");
    // this.getprograms();
    this.getProgramFromStorage();
    // this.programList = [
    //   {
    //     _id: "5ec227d4df3511bcf7b047a7",
    //     externalId: "Test-Program",
    //     name: "Test",
    //     description: "Test",
    //     solutions: [
    //       {
    //         _id: "5ec397a9df3511bcf7b26f9a",
    //         externalId: "Test-solutions",
    //         name: "Test",
    //         description: "Test",
    //         type: "assessment",
    //         subType: "institutional",
    //         entities: [
    //           {
    //             _id: "5da70ff54c67d63cca1b8ee2",
    //             submissionId: "5ec3a24b2ac20b6825930d8a",
    //             submissionStatus: "completed",
    //             externalId: "3020509002",
    //             name: "Test-school",
    //             city: "KOTLI DHOLE SHAH",
    //             state: "Punjab",
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // ];
  }
  getProgramFromStorage() {
    this.localStorage
      .getLocalStorage("programList")
      .then((data) => {
        if (data) {
          this.programList = data;
        } else {
          this.getprograms();
        }
      })
      .catch((error) => {
        this.getprograms();
      });
  }

  getprograms() {
    let url = AppConfigs.programs.programList;
    this.programService
      .getProgramApi()
      .then((programs) => {
        this.programList = programs;
      })
      .catch((error) => {});
  }

  goToProgramSol(programIndex) {
    this.navCtrl.push(ProgramSolutionPage, {
      programIndex: programIndex,
    });
  }
}
