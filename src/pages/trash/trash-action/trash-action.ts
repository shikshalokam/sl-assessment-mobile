import { Component } from "@angular/core";
import { NavController, NavParams, AlertController, ViewController } from "ionic-angular";
import { ProgramServiceProvider } from "../../programs/program-service";
import { UtilsProvider } from "../../../providers/utils/utils";
import { TrashProvider } from "../../../providers/trash/trash";

@Component({
  selector: "page-trash-action",
  templateUrl: "trash-action.html",
})
export class TrashActionPage {
  solutionId: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController,
    public programSrvc: ProgramServiceProvider,
    public utils: UtilsProvider,
    public trashProvider: TrashProvider
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad TrashActionPage");
    this.solutionId = this.navParams.get("solutionId");
  }
  presentConfirm() {
    let alert;

    alert = this.alertCtrl.create({
      message: "The solution will no longer be accessible",

      buttons: [
        {
          text: "Cancel",
          handler: () => {
            this.viewCtrl.dismiss();
          },
        },
        {
          text: "Delete Permanently",
          handler: () => {
            this.deleteSolFromTrash();
          },
        },
      ],
    });

    alert.present();
  }


  deleteSolFromTrash() {
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

  restoreSolFromTrash() {
    this.trashProvider
      .restoreSolFromTrash(this.solutionId)
      .then((res: any) => {
        this.utils.openToast(res.message);
        res.result == this.solutionId ? this.viewCtrl.dismiss("refresh") : this.viewCtrl.dismiss();
      })
      .catch((err) => {
        this.utils.openToast(err.message);
      });
  }
}
