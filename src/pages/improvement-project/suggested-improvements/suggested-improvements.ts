import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { ApiProvider } from "../../../providers/api/api";
import { UtilsProvider } from "../../../providers/utils/utils";
import { AppConfigs } from "../../../providers/appConfig";

/**
 * Generated class for the SuggestedImprovementsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: "page-suggested-improvements",
  templateUrl: "suggested-improvements.html",
})
export class SuggestedImprovementsPage {
  solName: any;
  improvementProject: any;
  solutionId: any;
  entityId: any;
  programId: any;
  entityType: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private apiService: ApiProvider,
    private utils: UtilsProvider
  ) {
    this.solName = this.navParams.get("heading");
    this.solutionId = this.navParams.get("solutionId");
    this.entityId = this.navParams.get("entityId");
    this.entityType = this.navParams.get("entityType");
    this.programId = this.navParams.get("programId");
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad SuggestedImprovementsPage");
    this.getImprovementProjects();
  }

  getImprovementProjects() {
    let url = AppConfigs.improvementProject.listImprovementProjects;
    let payload = {
      entityType: this.entityType,
      entityId: this.entityId,
      programId: this.programId,
      solutionId: this.solutionId,
    };
    this.utils.startLoader();
    this.apiService.httpPost(
      url,
      payload,
      (success) => {
        this.utils.stopLoader();
        console.log(JSON.stringify(success));

        if (success.result === true && success.data) {
          this.improvementProject = success.data;
        } else {
          this.utils.openToast(success.data);
        }
      },
      (error) => {
        this.utils.openToast(error.message);

        this.utils.stopLoader();
      },
      { baseUrl: "dhiti", version: "v1" }
    );
  }

  openBodh(link) {
    window.open(link, "_system");
  }
}
