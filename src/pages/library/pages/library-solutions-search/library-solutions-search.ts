import { Component, ViewChild } from "@angular/core";
import { NavController, NavParams, Searchbar } from "ionic-angular";
import { LibraryProvider } from "../../library-provider/library";
import { LibrarySolutionDetailsPage } from "../library-solution-details/library-solution-details";
import { storageKeys } from "../../../../providers/storageKeys";
import { LocalStorageProvider } from "../../../../providers/local-storage/local-storage";
import { isArray } from "ionic-angular/umd/util/util";

/**
 * Generated class for the LibrarySolutionsSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: "page-library-solutions-search",
  templateUrl: "library-solutions-search.html",
})
export class LibrarySolutionsSearchPage {
  searchText: any = "";
  solutionsList: any = null;
  page: number = 1;
  count: any;
  iconData: any;
  @ViewChild("searchbar") searchbar: Searchbar;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public libraryProvider: LibraryProvider,
    public localStorage: LocalStorageProvider
  ) {}
  ionViewDidEnter() {
    this.getIcons();
  }

  getIcons() {
    this.localStorage
      .getLocalStorage(storageKeys.libraryCategories)
      .then((data) => {
        let object = Object.assign(
          {},
          ...data.map((object) => ({ [object.type]: object.localUrl }))
        );
        console.log(object);
        this.iconData = object;
      })
      .then((res) => {
        this.searchSolutions();
        setTimeout(() => {
          this.searchbar.setFocus();
        }, 500);
      })
      .catch((err) => {});
  }

  searchSolutions() {
    this.libraryProvider
      .getLibrarySearchSolutions(this.searchText, this.page)
      .then((res) => {
        Array.isArray(this.solutionsList)
          ? (this.solutionsList = [...this.solutionsList, ...res["data"]])
          : (this.solutionsList = res["data"]);
        this.count = res["count"];
      })
      .catch((err) => {
        this.solutionsList = [];
      });
  }

  onInput() {
    this.page = 1;
    this.solutionsList = null;
    this.searchSolutions();
  }

  doInfinite(infiniteScroll) {
    this.page = this.page + 1;
    setTimeout(() => {
      this.searchSolutions();
      infiniteScroll.complete();
    }, 500);
  }

  goToSolutionDetails(solutionId, type) {
    this.navCtrl.push(LibrarySolutionDetailsPage, {
      solutionId: solutionId,
      type: type,
    });
  }
}
