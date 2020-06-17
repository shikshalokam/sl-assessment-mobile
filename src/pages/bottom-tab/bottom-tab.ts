import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { HomePage } from "../home/home";
import { InstitutionPage } from "../institution/institution";
import { LibraryPage } from "../library/library";
import { ReportsPage } from "../reports/reports";

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
  reportsRoot = ReportsPage;
  // myIndex: number;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    /* this.myIndex = 0;
    if (navParams.data.index) this.myIndex = navParams.data.index; */
  }
}
