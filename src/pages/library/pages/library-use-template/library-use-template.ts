import { Component } from "@angular/core";
import { NavController, NavParams, ModalController, App } from "ionic-angular";
import { LibraryProvider } from "../../library-provider/library";
import { FormGroup, FormControl } from "@angular/forms";
import { LibrarayEntityListComponent } from "../../components/libraray-entity-list/libraray-entity-list";
import { UtilsProvider } from "../../../../providers/utils/utils";
import { ProgramServiceProvider } from "../../../programs/program-service";
import { ProgramsPage } from "../../../programs/programs";
import { LibraryPage } from "../../library";

/**
 * Generated class for the LibraryUseTemplatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: "page-library-use-template",
  templateUrl: "library-use-template.html",
})
export class LibraryUseTemplatePage {
  template: any;
  name: string;
  description: any;
  program = { id: "", name: "" };
  solutionId: any;
  metaForm: any;
  entityList: any = [];
  addObservationForm: any;
  obervationProgramName;
  privateProgramList: any[] = [];
  createNew: any;
  selectedPrivate: any;
  draft: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public libraryProvider: LibraryProvider,
    public modalCntrl: ModalController,
    public utils: UtilsProvider,
    public programService: ProgramServiceProvider,
    public app: App
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad LibraryUseTemplatePage");
    this.template = this.navParams.get("selectedTemplate");
    this.solutionId = this.navParams.get("solutionId");
    this.draft = this.navParams.get("draft"); // if coming from draft
    this.solutionId ? null : (this.solutionId = this.draft.solutionId);
    this.generateTemplateForm(this.solutionId);
    this.getPrivateProgram();
  }

  generateTemplateForm(solutionId) {
    this.libraryProvider
      .getSolutionMetaForm(solutionId)
      .then((res) => {
        console.log("solutionTemplateMeta", solutionId, res);
        this.metaForm = res;
        this.metaForm.forEach((element) => {
          switch (element.field) {
            case "name":
              element.value = this.draft ? this.draft.name : this.template.name;
              break;
            case "description":
              element.value = this.draft
                ? this.draft.description
                : this.template.name;
          }
        });

        this.addObservationForm = this.utils.createFormGroup(this.metaForm);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  openEntityModel(): void {
    console.log("open modal");
    let editData = {
      entities: this.entityList.filter((e) => e.selected).map((e) => e._id),
      solutionId: this.solutionId,
    };
    let matrixModal = this.modalCntrl.create(LibrarayEntityListComponent, {
      editData,
    });
    matrixModal.onDidDismiss((entityList) => {
      entityList ? (this.entityList = entityList) : null;
    });
    matrixModal.present();
  }

  createObservation() {
    let data = this.createPayload();
    data["status"] = "published";
    console.log(this.addObservationForm);
    data["program"] = this.createProgramPayload();
    console.log(data);

    this.libraryProvider
      .createObservation(data, this.solutionId)
      .then(async (res) => {
        console.log("observationCreated", res);
        await this.refreshLocalObservationList();
        this.draft ? await this.saveToDraft("delete") : null;
        this.navCtrl.popToRoot();
        this.navCtrl.push(ProgramsPage);
      })
      .catch((err) => {
        console.log("observationCreationFailed", err);
      });
  }

  createPayload() {
    let payLoad = this.addObservationForm
      ? this.addObservationForm.getRawValue()
      : {};
    payLoad["entities"] =
      this.addObservationForm && this.addObservationForm.valid
        ? this.getSelectedEntities()
        : [];

    console.log(payLoad);
    return payLoad;
  }
  createProgramPayload() {
    if (this.createNew) {
      return {
        id: "",
        name: this.obervationProgramName,
      };
    } else {
      return {
        id: this.selectedPrivate ? this.selectedPrivate._id : null,
        name: this.selectedPrivate ? this.selectedPrivate.name : null,
      };
    }
  }

  checkFormvalid() {
    if (this.addObservationForm) return this.addObservationForm.valid;
    else return false;
  }
  getSelectedEntities() {
    return this.entityList.filter((e) => e.selected).map((e) => e._id);
  }

  getPrivateProgram() {
    this.libraryProvider
      .getPrivateProgram()
      .then((res: any[]) => {
        console.log("getPrivateProgram", res);
        this.privateProgramList = res;
        this.draft
          ? this.draft.program.id
            ? (this.selectedPrivate = this.draft.program)
            : ((this.obervationProgramName = this.draft.program.name),
              (this.createNew = true))
          : null;
        this.draft ? (this.entityList = this.draft.entityList) : null;
      })
      .catch((err) => {
        this.privateProgramList = [];
        console.log("getPrivateProgram", err);
        this.createNew = true;
      });
  }

  async refreshLocalObservationList() {
    await this.programService
      .refreshObservationList()
      .then((data) => {})
      .catch((error) => {});
  }

  saveToDraft(deleteDraft?) {
    let draft = this.addObservationForm.getRawValue();
    draft.entityList = this.entityList;
    draft["program"] = this.createProgramPayload();
    draft["time"] = new Date().toUTCString();
    draft["solutionId"] = this.solutionId;

    this.utils.startLoader();
    this.libraryProvider
      .getLibraryDraft()
      .then((items) => {
        this.draft
          ? (items = items.filter((i) => i.time !== this.draft.time))
          : null;
        deleteDraft ? null : items.push(draft);
        return items;
      })
      .then((items) => {
        console.log(items);
        this.libraryProvider.saveLibraryDraft(items);
      })
      .then((res) => {
        this.navCtrl.push(LibraryPage);
        this.utils.stopLoader();
      })
      .catch((err) => {
        console.log(err);
        this.utils.stopLoader();
      });
  }
}
