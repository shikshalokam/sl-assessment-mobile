import { Component } from "@angular/core";
import { NavController, NavParams, ModalController } from "ionic-angular";
import { LibraryProvider } from "../../library-provider/library";
import { FormGroup, FormControl } from "@angular/forms";
import { LibrarayEntityListComponent } from "../../components/libraray-entity-list/libraray-entity-list";
import { UtilsProvider } from "../../../../providers/utils/utils";
import { ProgramServiceProvider } from "../../../programs/program-service";

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public libraryProvider: LibraryProvider,
    public modalCntrl: ModalController,
    public utils: UtilsProvider,
    public programService: ProgramServiceProvider
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad LibraryUseTemplatePage");
    this.template = this.navParams.get("selectedTemplate");
    this.solutionId = this.navParams.get("solutionId");
    this.generateTemplateForm(this.solutionId);
    this.getPrivateProgram();
  }

  generateTemplateForm(solutionId) {
    this.libraryProvider
      .getObservationMetaForm(solutionId)
      .then((res) => {
        console.log("solutionTemplateMeta", solutionId, res);
        this.metaForm = res;
        this.metaForm.forEach((element) => {
          switch (element.field) {
            case "name":
              element.value = this.template.name;
              break;
            case "description":
              element.value = this.template.name;
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
    if (this.createNew) {
      data["program"] = {
        id: "",
        name: this.obervationProgramName,
      };
    } else {
      data["program"] = {
        id: this.selectedPrivate._id,
        name: this.selectedPrivate.name,
      };
    }

    console.log(data);

    this.libraryProvider
      .createObservation(data, this.solutionId)
      .then((res) => {
        console.log("observationCreated", res);
        this.refreshLocalObservationList();
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
      })
      .catch((err) => {
        this.privateProgramList = [];
        console.log("getPrivateProgram", err);
        this.createNew = true;
      });
  }

  refreshLocalObservationList() {
    this.programService
      .refreshObservationList()
      .then((data) => {})
      .catch((error) => {});
  }
}
