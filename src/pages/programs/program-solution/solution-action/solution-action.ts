import { Component } from "@angular/core";
import { NavController, NavParams, AlertController, ViewController } from "ionic-angular";
import { ProgramServiceProvider } from "../../program-service";
import { UtilsProvider } from "../../../../providers/utils/utils";

@Component({
  selector: "page-solution-action",
  templateUrl: "solution-action.html",
})
export class SolutionActionPage {
  solutionId: any;
  isAPrivateProgram: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController,
    public programSrvc: ProgramServiceProvider,
    public utils: UtilsProvider
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad SolutionActionPage");
    this.solutionId = this.navParams.get("solutionId");
    this.isAPrivateProgram = this.navParams.get("isAPrivateProgram");
  }

  removeSolFromHome() {
    this.programSrvc
      .removesolFromHome(this.solutionId)
      .then((res: any) => {
        this.utils.openToast(res.message);
        res.result == this.solutionId ? this.viewCtrl.dismiss("refresh") : this.viewCtrl.dismiss();
      })
      .catch((err) => {
        this.utils.openToast(err.message);
        this.viewCtrl.dismiss();
      });
  }

  delete() {
    this.programSrvc
      .deleteSolPermanently(this.solutionId)
      .then((res: any) => {
        this.utils.openToast(res.message);
        res.result == this.solutionId ? this.viewCtrl.dismiss("refresh") : this.viewCtrl.dismiss();
      })
      .catch((err) => {
        this.utils.openToast(err.message);
      });
  }

  trash() {
    this.programSrvc
      .trashSol(this.solutionId)
      .then((res: any) => {
        this.utils.openToast(res.message);
        res.result == this.solutionId ? this.viewCtrl.dismiss("refresh") : this.viewCtrl.dismiss();
      })
      .catch((err) => {
        this.utils.openToast(err.message);
        this.viewCtrl.dismiss();
      });
  }

  presentConfirm(deleteFlag = false) {
    let alert;
    if (deleteFlag) {
      alert = this.alertCtrl.create({
        // title: "Confirm purchase",
        message: "The solution will no longer be accessible",

        buttons: [
          {
            text: "Move To Trash",
            handler: () => {
              this.trash();
            },
          },
          {
            text: "Delete Permanently",
            handler: () => {
              this.delete();
            },
          },
        ],
      });
    } else {
      alert = this.alertCtrl.create({
        // title: "Confirm purchase",
        message: "The solution will no longer appear on the home screen",
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            handler: () => {
              this.viewCtrl.dismiss();
            },
          },
          {
            text: "Continue",
            handler: () => {
              this.removeSolFromHome();
            },
          },
        ],
      });
    }

    alert.present();
  }
}
