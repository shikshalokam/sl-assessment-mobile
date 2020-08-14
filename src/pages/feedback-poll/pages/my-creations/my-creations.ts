import { Component } from "@angular/core";
import { NavController, NavParams, AlertController } from "ionic-angular";
import { PollProvider } from "../../providers/poll/poll";
import { TranslateService } from "@ngx-translate/core";
import { CreatePollPage } from "../create-poll/create-poll";

/**
 * Generated class for the MyCreationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: "page-my-creations",
  templateUrl: "my-creations.html",
})
export class MyCreationsPage {
  selectedTab: any;
  allDrafts: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public pollProvider: PollProvider,
    public alertCtrl: AlertController,
    public translate: TranslateService
  ) {}

  ionViewDidEnter() {
    console.log("ionViewDidLoad MyCreationsPage");
    this.getDrafts();
    this.onTabChange("draft");
  }

  onTabChange(tabName) {
    this.selectedTab = tabName;
  }
  getDrafts() {
    this.pollProvider
      .getPollDraft()
      .then((items) => {
        console.log("drafts", items);
        this.allDrafts = items;
      })
      .catch((err) => {
        console.log(err);
        this.allDrafts = [];
      });
  }

  removeDraft(draftTime) {
    this.pollProvider
      .deleteDraft(draftTime)
      .then((res) => {
        this.getDrafts();
      })
      .catch((err) => {});
  }

  showConfirm(draftTime, name) {
    let translateObject;
    this.translate.get(["actionSheet.deleteDraft", "actionSheet.yes", "actionSheet.no"]).subscribe((translations) => {
      translateObject = translations;
    });
    const confirm = this.alertCtrl.create({
      title: translateObject["actionSheet.deleteDraft"],
      message: `Do you agree to delete ${name} from drafts?`,
      buttons: [
        {
          text: translateObject["actionSheet.no"],
          handler: () => {
            console.log("Cancel clicked");
          },
        },
        {
          text: translateObject["actionSheet.yes"],
          handler: () => {
            console.log("Delete clicked");
            this.removeDraft(draftTime);
          },
        },
      ],
    });
    confirm.present();
  }
  goToCreatePoll(draft) {
    this.navCtrl.push(CreatePollPage, { draft });
  }
}
