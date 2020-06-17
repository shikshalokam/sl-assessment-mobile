import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, App } from "ionic-angular";
import { AppConfigs } from "../../providers/appConfig";
import { ApiProvider } from "../../providers/api/api";
import { UtilsProvider } from "../../providers/utils/utils";
import { InstitutionSolutionPage } from "./institution-solution/institution-solution";
import { InstitutionServiceProvider } from "./institution-service";
import { LocalStorageProvider } from "../../providers/local-storage/local-storage";
import { storageKeys } from "../../providers/storageKeys";

/**
 * Generated class for the InstitutionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-institution",
  templateUrl: "institution.html",
})
export class InstitutionPage {
  institutionsList: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private apiService: ApiProvider,
    private utils: UtilsProvider,
    private institutionService: InstitutionServiceProvider,
    private localStorage: LocalStorageProvider,
    private app: App
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad InstitutionPage");
    this.getProgramFromStorage();
  }

  getProgramFromStorage() {
    this.utils.startLoader();
    this.institutionService
      .getInstituionFromStorage()
      .then((institutions) => {
        this.institutionsList = institutions;
        this.utils.stopLoader();
      })
      .catch((error) => {
        this.institutionsList = null;
        this.utils.stopLoader();
      });
  }

  goToInstitutionSol(entityType, entityIndex) {
    let navData = { entityType: entityType, entityIndex: entityIndex };
    // this.navCtrl.push(InstitutionSolutionPage, { navData });
    this.app.getRootNav().push(InstitutionSolutionPage, { navData });
  }
}
