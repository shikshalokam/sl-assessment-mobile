import { Component } from "@angular/core";
import { NavController, NavParams, AlertController, ModalController } from "ionic-angular";
import { ThanksComponent } from "../../../../components/thanks/thanks";

@Component({
  selector: "page-poll-preview",
  templateUrl: "poll-preview.html",
})
export class PollPreviewPage {
  question: any;
  options: any;
  selectedResponseType: any;
  type: string; // create or submit poll
  response: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad PollPreviewPage");
    const navData = this.navParams.data;
    this.question = navData.question;
    this.options = navData.options;
    this.selectedResponseType = navData.selectedResponseType;
    this.type = navData.type;
  }

  showConfirm() {
    const confirm = this.alertCtrl.create({
      title: "",
      message: "Do you want to share the form?",
      buttons: [
        {
          text: "Disagree",
          handler: () => {
            console.log("Disagree clicked");
          },
        },
        {
          text: "Agree",
          handler: () => {
            console.log("Agree clicked");
          },
        },
      ],
    });
    confirm.present();
  }

  submitResponse() {
    console.log(this.response);
    this.showThanks();
  }

  showThanks(): void {
    const thanksModal = this.modalCtrl.create(ThanksComponent, { userId: 8675309 });
    thanksModal.present();
  }
}
