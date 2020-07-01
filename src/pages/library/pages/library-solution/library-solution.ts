import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { LibraryProvider } from "../../library-provider/library";
import { LibrarySolutionDetailsPage } from "../library-solution-details/library-solution-details";

/**
 * Generated class for the LibrarySolutionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: "page-library-solution",
  templateUrl: "library-solution.html",
})
export class LibrarySolutionPage {
  type: any;
  solutionList: any;
  search;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public libraryProvider: LibraryProvider
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad LibrarySolutionPage");
    this.type = this.navParams.get("type");
    this.getSolution();
  }
  getSolution() {
    this.libraryProvider
      .getObservationSolutionsList(this.type)
      .then((res) => {
        this.solutionList = res["data"];
        console.log("observationSolution", res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  goToSolutionDetails(solutionId) {
    this.navCtrl.push(LibrarySolutionDetailsPage, {
      solutionId: solutionId,
      type: this.type,
    });
  }
}
