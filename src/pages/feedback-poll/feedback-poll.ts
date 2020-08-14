import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { CreatePollPage } from "./pages/create-poll/create-poll";
import { MyCreationsPage } from "./pages/my-creations/my-creations";

@IonicPage()
@Component({
  selector: "page-feedback-poll",
  templateUrl: "feedback-poll.html",
})
export class FeedbackPollPage {
  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad FeedbackPollPage");
  }

  goToPage(page: string): void {
    switch (page) {
      case "create":
        this.navCtrl.push(CreatePollPage);
        break;
      case "myCreations":
        this.navCtrl.push(MyCreationsPage);
        break;

      default:
        break;
    }
  }
}
