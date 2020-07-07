import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, App } from "ionic-angular";
import { LibrarySolutionPage } from "./pages/library-solution/library-solution";
import { LibraryDraftPage } from "./pages/library-draft/library-draft";
import { LibraryProvider } from "./library-provider/library";
import { LibrarySolutionsSearchPage } from "./pages/library-solutions-search/library-solutions-search";

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
  // libraryComponents = [
  //   {
  //     name: "Individual Assessments",
  //     url:
  //       "https://storage.googleapis.com/download/storage/v1/b/sl-dev-storage/o/static%2Flibrary%2Fcategories%2FindividualAssessments.png?generation=1593694445292104&alt=media",
  //     type: "individual",
  //   },
  //   {
  //     name: "Institutional Assessments",
  //     url:
  //       "https://storage.googleapis.com/download/storage/v1/b/sl-dev-storage/o/static%2Flibrary%2Fcategories%2FinstitutionalAssessments.png?generation=1593694446262158&alt=media",
  //     type: "institutional",
  //   },
  //   {
  //     name: "Observation Solutions",
  //     url:
  //       "https://storage.googleapis.com/download/storage/v1/b/sl-dev-storage/o/static%2Flibrary%2Fcategories%2FindividualAssessments.png?generation=1593694445292104&alt=media",
  //     type: "observation",
  //   },
  //   {
  //     name: "Drafts",
  //     url:
  //       "https://storage.googleapis.com/download/storage/v1/b/sl-dev-storage/o/static%2Flibrary%2Fcategories%2Fdrafts.png?generation=1593694447711792&alt=media",
  //     type: "draft",
  //   },
  // ];
  searchText: any;
  libraryComponents: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public app: App,
    public libraryProvider: LibraryProvider
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad LibraryPage");
    this.getLibraryCategories();
  }
  ionViewDidEnter() {
    this.searchText = null;
  }

  getLibraryCategories() {
    this.libraryProvider
      .getLibraryCategories()
      .then((res: any) => {
        console.log("LibraryPage -> getLibraryCategories -> res", res);
        this.libraryComponents = res;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  goToComponent(type) {
    switch (true) {
      case type == "observation" ||
        type == "institutional" ||
        type == "individual":
        // this.app.getRootNav().push(LibrarySolutionPage, { type: type });
        this.navCtrl.push(LibrarySolutionPage, { type: type });
        break;
      case type == "drafts":
        this.navCtrl.push(LibraryDraftPage, { type: type });
        break;

      default:
        break;
    }
  }

  redirectToSearch() {
    this.navCtrl.push(LibrarySolutionsSearchPage, {
      searchText: this.searchText,
    });
  }
}
