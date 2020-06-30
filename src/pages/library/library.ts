import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, App } from "ionic-angular";
import { LibrarySolutionPage } from "./pages/library-solution/library-solution";
import { LibraryDraftPage } from "./pages/library-draft/library-draft";

/**
 * Generated class for the LibraryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-library",
  templateUrl: "library.html",
})
export class LibraryPage {
  libraryComponents = [
    {
      name: "Individual Assessments",
      url:
        "http://sl-dev-storage.storage.googleapis.com/library/individualAssessments.png",
    },
    {
      name: "Institutional Assessments",
      url:
        "http://sl-dev-storage.storage.googleapis.com/library/individualAssessments.png",
    },
    {
      name: "Observation Solutions",
      url:
        "http://sl-dev-storage.storage.googleapis.com/library/individualAssessments.png",
      type: "observation",
    },
    {
      name: "Drafts",
      url:
        "http://sl-dev-storage.storage.googleapis.com/library/individualAssessments.png",
      type: "draft",
    },
  ];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public app: App
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad LibraryPage");
  }

  goToComponent(type) {
    switch (type) {
      case "observation":
        this.app.getRootNav().push(LibrarySolutionPage, { type: type });
        break;
      case "draft":
        this.app.getRootNav().push(LibraryDraftPage, { type: type });
        break;

      default:
        break;
    }
  }
}
