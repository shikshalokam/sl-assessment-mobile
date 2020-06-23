import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { HomePage } from "../home/home";
import { InstitutionPage } from "../institution/institution";
import { LibraryPage } from "../library/library";
import { ReportsPage } from "../reports/reports";
import { SidemenuProvider } from "../../providers/sidemenu/sidemenu";
import { LocalStorageProvider } from "../../providers/local-storage/local-storage";
import { UtilsProvider } from "../../providers/utils/utils";
import { RoleListingPage } from "../role-listing/role-listing";
import { ReportEntityListingPage } from "../reports/report-entity-listing/report-entity-listing";
import { CurrentUserProvider } from "../../providers/current-user/current-user";
import { ApiProvider } from "../../providers/api/api";
import { AppConfigs } from "../../providers/appConfig";
import { Subject } from "rxjs/Subject";

/**
 * Generated class for the BottomTabPage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-bottom-tab",
  templateUrl: "bottom-tab.html",
})
export class BottomTabPage {
  homeRoot = HomePage;
  institutionRoot = InstitutionPage;
  libraryRoot = LibraryPage;
  reportsRoot;
  sideMenuSubscription: any;
  showReport: boolean;
  data: any;
  $showDashboard = new Subject<boolean>();
  profileRoles: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public sideMenuProvide: SidemenuProvider,
    public localStorage: LocalStorageProvider,
    public utils: UtilsProvider,
    private currentUser: CurrentUserProvider,
    private apiProvider: ApiProvider
  ) {
    /* 
    show report and dashboard is same page only name is different
     */
    this.sideMenuSubscription = this.sideMenuProvide.$showDashboard.subscribe(
      (showDashboard) => {
        this.showReport = showDashboard;
        this.getProfileroles();
      }
    );
  }

  getProfileroles() {
    this.localStorage
      .getLocalStorage("profileRole")
      .then((success) => {
        let roles = success;

        if (roles.roles.length > 1) {
          // this.data = { from: "dashboard" };
          this.reportsRoot = RoleListingPage;
        } else {
          this.data = {
            currentEntityType: roles.roles[0].immediateSubEntityType,
            data: roles.roles[0].entities,
            entityType: roles.roles[0].entities[0].immediateSubEntityType,
            from: "bottomTab",
          };
          this.reportsRoot = ReportEntityListingPage;
        }
      })
      .catch((error) => {});
  }
}
