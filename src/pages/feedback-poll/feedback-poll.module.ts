import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { FeedbackPollPage } from "./feedback-poll";
import { ComponentsModule } from "../../components/components.module";
import { TranslateModule } from "@ngx-translate/core";
import { CreatePollPage } from "./pages/create-poll/create-poll";
import { PollPreviewPage } from "./pages/poll-preview/poll-preview";
import { MyCreationsPage } from "./pages/my-creations/my-creations";
import { PollProvider } from "./providers/poll/poll";

@NgModule({
  declarations: [FeedbackPollPage, CreatePollPage, PollPreviewPage, MyCreationsPage],
  imports: [IonicPageModule.forChild(FeedbackPollPage), ComponentsModule, TranslateModule],
  entryComponents: [FeedbackPollPage, CreatePollPage, PollPreviewPage, MyCreationsPage],
  providers: [PollProvider],
})
export class FeedbackPollPageModule {}
