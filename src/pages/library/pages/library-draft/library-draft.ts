import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { LibraryProvider } from "../../library-provider/library";
import { LibraryUseTemplatePage } from "../library-use-template/library-use-template";
import { UtilsProvider } from "../../../../providers/utils/utils";

/**
 * Generated class for the LibraryDraftPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: "page-library-draft",
  templateUrl: "library-draft.html",
})
export class LibraryDraftPage {
  allDrafts: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public libraryProvider: LibraryProvider,
    public utils: UtilsProvider
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad LibraryDraftPage");
    this.getDrafts();
  }

  getDrafts() {
    this.libraryProvider
      .getLibraryDraft()
      .then((items) => {
        console.log("drafts", items);
        this.allDrafts = items;
      })
      .catch((err) => {
        console.log(err);
        this.allDrafts = [];
      });
  }

  goToUseTemplate(draft) {
    this.navCtrl.push(LibraryUseTemplatePage, { draft });
  }

  removeDraft(draftTime) {
    this.libraryProvider
      .deleteDraft(draftTime)
      .then((res) => {
        this.getDrafts();
      })
      .catch((err) => {});
  }
}
