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
    private programService: ProgramServiceProvider,
    private utils: UtilsProvider
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad ProgramsPage");
    this.getProgramFromStorage();
  }
  getProgramFromStorage() {
    this.utils.startLoader();
    this.localStorage
      .getLocalStorage("programList")
      .then((data) => {
        if (data) {
          this.programList = data;
          this.programService.migrationFuntion(data);
        } else {
          this.getprograms();
        }
        this.utils.stopLoader();
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
        this.programService.migrationFuntion(programs);
      })
      .catch((error) => {});
  }

  goToProgramSol(programIndex) {
    this.navCtrl.push(ProgramSolutionPage, {
      programIndex: programIndex,
    });
  }
}
