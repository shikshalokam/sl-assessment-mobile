import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { DashboardPage } from "../../dashboard/dashboard";
import { UtilsProvider } from "../../../providers/utils/utils";
import { ApiProvider } from "../../../providers/api/api";
import { AppConfigs } from "../../../providers/appConfig";

/**
 * Generated class for the ReportProgramSolutionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: "page-report-program-solution",
  templateUrl: "report-program-solution.html",
})
export class ReportProgramSolutionPage {
  programName: any;
  programId: any;
  entity: any;
  solutionList: any;
  selectedTab: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public utils: UtilsProvider,
    private apiProvider: ApiProvider
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad ReportProgramSolutionPage");
    this.selectedTab = "my";
    let data = this.navParams.get("data");
    this.programName = data.programName;
    this.programId = data.programId;
    this.entity = data.entity;

    this.getReportProgramSolution();
  }

  onTabChange(tabName) {
    this.selectedTab = tabName;
  }

  getReportProgramSolution() {
    this.utils.startLoader();
    this.apiProvider.httpPost(
      AppConfigs.reports.solutions,
      {
        entityId: this.entity._id,
        entityType: this.entity.entityType,
        programId: this.programId,
      },
      (success) => {
        success.data
          ? (this.solutionList = success.data)
          : (this.solutionList = []);
        this.utils.stopLoader();
      },
      (error) => {
        this.solutionList = [];
        this.utils.stopLoader();
        this.utils.openToast(error);
      },
      { baseUrl: "dhiti" }
    );
  }

  getReportsAccordingToSolution(solutionId, solutionName) {
    this.navCtrl.push(DashboardPage, {
      entity: this.entity,
      programId: this.programId,
      solutionId: solutionId,
      solutionName: solutionName,
    });
  }
}
