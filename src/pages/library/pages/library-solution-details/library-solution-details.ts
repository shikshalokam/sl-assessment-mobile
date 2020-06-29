import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { LibraryProvider } from "../../library-provider/library";
import { LibraryUseTemplatePage } from "../library-use-template/library-use-template";

/**
 * Generated class for the LibrarySolutionDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: "page-library-solution-details",
  templateUrl: "library-solution-details.html",
})
export class LibrarySolutionDetailsPage {
  solutionId: any;
  template: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public libraryProvider: LibraryProvider
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad LibrarySolutionDetailsPage");
    this.solutionId = this.navParams.get("solutionId");
    this.getSolutionTemplate(this.solutionId);
  }
  getSolutionTemplate(solutionId) {
    this.libraryProvider
      .getSolutiontemplate(solutionId)
      .then((res) => {
        this.template = res;
        console.log("solutionTemplate", this.solutionId, res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  goToUseTemplate() {
    this.navCtrl.push(LibraryUseTemplatePage, {
      selectedTemplate: this.template,
      solutionId: this.solutionId,
    });
  }
}
