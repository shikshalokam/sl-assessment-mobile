import { Component } from "@angular/core";
import { NavController, NavParams, AlertController, ViewController } from "ionic-angular";
import { UtilsProvider } from "../../../../providers/utils/utils";
import { PollPreviewPage } from "../poll-preview/poll-preview";
import { PollProvider } from "../../providers/poll/poll";
import { FeedbackPollPage } from "../../feedback-poll";

@Component({
  selector: "page-create-poll",
  templateUrl: "create-poll.html",
})
export class CreatePollPage {
  pollForm: any;
  options: any = [];
  selectedResponseType: string;
  draft: any;
  metaForm: any = [
    {
      field: "name",
      label: "Name of the Poll",
      value: "",
      visible: true,
      editable: true,
      validation: {
        required: true,
      },
      input: "text",
    },
    {
      field: "creator",
      label: "Name of the Creator",
      value: "",
      visible: true,
      editable: true,
      validation: {
        required: true,
      },
      input: "text",
    },
    {
      field: "endDate",
      label: "End Date",
      value: "",
      visible: true,
      editable: true,
      validation: {
        required: true,
      },
      input: "radio",
      options: [
        {
          value: 1,
          label: "one day",
        },
        {
          value: 2,
          label: "two day",
        },
        {
          value: 3,
          label: "",
        },
        {
          value: 4,
          label: "",
        },
        {
          value: 5,
          label: "",
        },
        {
          value: 6,
          label: "",
        },
        {
          value: 7,
          label: "",
        },
      ],
    },
    {
      field: "question",
      label: "Question",
      value: "",
      visible: true,
      editable: true,
      validation: {
        required: true,
      },
      input: "text",
    },
  ];
  emoticons: any = [
    {
      unicode: "\u{1F44D}",
      description: "Happy",
    },
    {
      unicode: "\u{1F600}",
      description: "Happy",
    },
  ];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private utils: UtilsProvider,
    public alertCtrl: AlertController,
    public pollProvider: PollProvider,
    public viewCntl: ViewController
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad CreatePollPage");

    this.draft = this.navParams.get("draft");
    if (this.draft) {
      this.options = this.draft.options;
      this.selectedResponseType = this.draft.selectedResponseType;
    }
    this.metaForm.forEach((element) => {
      switch (element.field) {
        case "name":
          element.value = this.draft ? this.draft.name : element.value;
          break;
        case "creator":
          element.value = this.draft ? this.draft.creator : element.value;
          break;
        case "endDate":
          element.value = this.draft ? this.draft.endDate : element.value;
          break;
        case "question":
          element.value = this.draft ? this.draft.question : element.value;
      }
    });
    this.pollForm = this.utils.createFormGroup(this.metaForm);
  }

  addOption() {
    if (this.selectedResponseType == "emoticons" || this.selectedResponseType == "gestures") {
      this.addEGOption();
      return;
    }

    const prompt = this.alertCtrl.create({
      title: "Add New Option",
      inputs: [
        {
          name: "option",
          placeholder: "Option...",
        },
      ],
      buttons: [
        {
          text: "Cancel",
        },
        {
          text: "Save",
          handler: (data) => {
            console.log(data);
            this.options.includes(data.option) ? null : this.options.push(data.option);
            console.log("Saved clicked");
          },
        },
      ],
    });
    prompt.present();
  }
  editOption(option) {
    const prompt = this.alertCtrl.create({
      title: "Edit Option",
      inputs: [
        {
          name: "option",
          placeholder: "Option...",
          value: option.description ? option.description : option,
        },
      ],
      buttons: [
        {
          text: "Cancel",
        },
        {
          text: "Save",
          handler: (data) => {
            const i = this.options.indexOf(option);
            option.description ? (this.options[i].description = data.option) : (this.options[i] = data.option);
          },
        },
        {
          text: "Delete",
          handler: () => {
            this.options = this.options.filter((opt) => opt != option);
          },
        },
      ],
    });
    prompt.present();
  }

  addEGOption() {
    let arr: any = [];
    this.emoticons.map((e, index) => {
      let x = {};
      x["type"] = "radio";
      x["label"] = e.unicode + " " + e.description;
      x["value"] = { unicode: e.unicode, description: e.description };
      x["description"] = e.description;
      arr[index] = x;
    });
    const alert = this.alertCtrl.create({
      title: "Select emoticon",
      inputs: arr,
      buttons: [
        {
          text: "Cancel",
        },
        {
          text: "Ok",
          handler: (data) => {
            console.log(data);
            this.options.some((opt) => opt.unicode == data.unicode) ? null : this.options.push(data);
          },
        },
      ],
    });
    alert.present();
  }

  share() {
    const form = this.pollForm.getRawValue();
    console.log(form);
    const navData = {
      options: this.options,
      question: form.question,
      selectedResponseType: this.selectedResponseType,
      type: "create",
    };
    this.navCtrl.push(PollPreviewPage, navData);
  }

  responseTypeChange(type) {
    if (this.selectedResponseType == type) {
      return;
    } else if (this.selectedResponseType == null || !this.options.length) {
      this.selectedResponseType = type;
      return;
    }
    const confirm = this.alertCtrl.create({
      title: "",
      message: "Previous options will be erased",
      buttons: [
        {
          text: "Cancel",
          handler: () => {
            console.log("Disagree clicked");
          },
        },
        {
          text: "Ok",
          handler: () => {
            console.log("Agree clicked");
            this.options = [];
            this.selectedResponseType = type;
          },
        },
      ],
    });
    confirm.present();
  }

  saveToDraft(deleteDraft?): void {
    console.log("draft");
    const draft = this.pollForm.getRawValue();
    draft["options"] = this.options;
    draft["selectedResponseType"] = this.selectedResponseType;
    draft["time"] = new Date().toUTCString();
    deleteDraft ? null : this.utils.startLoader();
    this.pollProvider
      .getPollDraft()
      .then((items) => {
        this.draft ? (items = items.filter((i) => i.time !== this.draft.time)) : null;
        deleteDraft ? null : items.push(draft);

        return items;
      })
      .then((items) => {
        console.log(items);
        this.pollProvider.savePollDraft(items);
        deleteDraft ? null : this.utils.openToast("Saved Draft");
      })
      .then((res) => {
        console.log("called");
        this.navCtrl.pop();
        deleteDraft ? null : this.utils.stopLoader();
      });
  }
}
