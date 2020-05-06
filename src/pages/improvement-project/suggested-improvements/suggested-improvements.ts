import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.solName = this.navParams.get("heading");
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad SuggestedImprovementsPage");
  }
  openBodh(link) {
    window.open(link, "_system");
  }
}
