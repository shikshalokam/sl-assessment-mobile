import { Component } from "@angular/core";
import { NavController, NavParams, ModalController } from "ionic-angular";
import { PollProvider } from "../../providers/poll/poll";
import { ResultGraphComponent } from "../../component/result-graph/result-graph";
import { UtilsProvider } from "../../../../providers/utils/utils";

@Component({
  selector: "page-poll-feedback-result",
  templateUrl: "poll-feedback-result.html",
})
export class PollFeedbackResultPage {
  selectedTab: string;
  polls: { name: string }[];
  feedbacks: { name: string }[] = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public pollProvider: PollProvider,
    public modalCntrl: ModalController,
    public utils: UtilsProvider
  ) {}

  ionViewDidLoad(): void {
    console.log("ionViewDidLoad PollFeedbackResultPage");
    this.onTabChange("poll");
    this.getPollList();
  }

  getPollList() {
    this.utils.startLoader();
    this.pollProvider
      .getPollList()
      .then((res: any) => {
        this.polls = res;
        this.utils.stopLoader();
      })
      .catch(() => this.utils.stopLoader());
  }

  onTabChange(tabName: string): void {
    this.selectedTab = tabName;
  }

  openResultModel(pollId): void {
    const resultModal = this.modalCntrl.create(ResultGraphComponent, {
      pollId: pollId,
    });
    // resultModal.onDidDismiss((result) => {});
    resultModal.present();
  }
}
