import { Component } from "@angular/core";
import { NavController, NavParams, ViewController } from "ionic-angular";
import { DeeplinkProvider } from "../../providers/deeplink/deeplink";
import { ProgramServiceProvider } from "../programs/program-service";
import { ProgramSolutionObservationDetailPage } from "../programs/program-solution-observation-detail/program-solution-observation-detail";

/**
 * Generated class for the DeepLinkRedirectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: "page-deep-link-redirect",
  templateUrl: "deep-link-redirect.html",
})
export class DeepLinkRedirectPage {
  data: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public deeplinkProvider: DeeplinkProvider,
    public programSrvc: ProgramServiceProvider,
    public viewCtrl: ViewController
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad DeepLinkRedirectPage");
    this.data = this.navParams.data;
    let key = Object.keys(this.data)[0];
    this.switch(key);
  }

  switch(key) {
    switch (key) {
      case "observationLink":
        this.redirectObservation(this.data[key]);
        break;

      default:
        break;
    }
  }

  redirectObservation(link) {
    let pId, sId, oId;
    this.deeplinkProvider
      .createObsFromLink(link)
      .then((res: any) => {
        if (!res.result) {
          throw "";
        }
        res = res.result;
        pId = res.programId;
        sId = res.solutionId;
        oId = res._id;
        return this.programSrvc.getProgramApi(true);
      })
      .then((data: any) => {
        console.log(data);
        const pIndex = data.findIndex((p) => p._id == pId);
        const solution = data[pIndex].solutions;
        const sIndex = solution.findIndex((s) => s.solutionId == sId);
        // const pIndex = data.findIndex(p => p.id == pId);
        this.navCtrl
          .push(ProgramSolutionObservationDetailPage, {
            programIndex: pIndex,
            solutionIndex: sIndex,
          })
          .then(() => {
            this.navCtrl.remove(1, 1);
          });
      });
  }
}
