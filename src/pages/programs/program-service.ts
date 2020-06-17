import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiProvider } from "../../providers/api/api";
import { LocalStorageProvider } from "../../providers/local-storage/local-storage";
import { UtilsProvider } from "../../providers/utils/utils";
import { AppConfigs } from "../../providers/appConfig";
import { UpdateLocalSchoolDataProvider } from "../../providers/update-local-school-data/update-local-school-data";
import { MenuItemComponent } from "../../components/menu-item/menu-item";
import { PopoverController } from "ionic-angular";
import { storageKeys } from "../../providers/storageKeys";

/*
  Generated class for the ProgramProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProgramServiceProvider {
  constructor(
    public http: HttpClient,
    private apiService: ApiProvider,
    private localStorage: LocalStorageProvider,
    private utils: UtilsProvider,
    private ulsdp: UpdateLocalSchoolDataProvider,
    private popoverCtrl: PopoverController
  ) {
    console.log("Hello ProgramProvider Provider");
  }

  getProgramFromStorage() {
    // this.utils.startLoader();
    return this.localStorage
      .getLocalStorage("programList")
      .then((data) => {
        if (data) {
          this.migrationFuntion(data);
          return data;
        } else {
          return this.getProgramApi(true);
        }
      })
      .catch((error) => {
        return this.getProgramApi(true);
      });
  }

  getProgramApi(noLoader?: boolean) {
    return new Promise((resolve, reject) => {
      const url = AppConfigs.programs.programList;

      !noLoader ? this.utils.startLoader() : null;

      this.apiService.httpGet(
        url,
        (successData) => {
          // console.log("success data")
          !noLoader ? this.utils.stopLoader() : null;
          // console.log(JSON.stringify(successData))
          /*  for (const program of successData.result) {
            for (const solution of program.solutions) {
              for (const entity of solution.entities) {
                entity.downloaded = false;
                entity.submissionId = null;
              }
            }
          } */

          this.localStorage.setLocalStorage(
            storageKeys.programList,
            successData.result
          );
          resolve(successData.result);
        },
        (error) => {
          //console.log("error in list of assessment")
          // this.utils.stopLoader();
          !noLoader ? this.utils.stopLoader() : null;

          reject();
        }
      );
    });
  }
  //  for individual and instituional

  getAssessmentDetails(event, programs) {
    return new Promise((resolve, reject) => {
      let programIndex = event.programIndex;
      let assessmentIndex = event.assessmentIndex;
      let entityIndex = event.entityIndex;
      let solutionId = programs[programIndex].solutions[assessmentIndex]._id;
      let entityId =
        programs[programIndex].solutions[assessmentIndex].entities[entityIndex]
          ._id;

      this.utils.startLoader();
      const url =
        AppConfigs.assessmentsList.detailsOfAssessment +
        programs[programIndex]._id +
        "?solutionId=" +
        solutionId +
        "&entityId=" +
        entityId;
      //console.log(url);
      this.apiService.httpGet(
        url,
        async (success) => {
          this.ulsdp.mapSubmissionDataToQuestion(success.result);
          const generalQuestions = success.result["assessment"][
            "generalQuestions"
          ]
            ? success.result["assessment"]["generalQuestions"]
            : null;
          this.localStorage.setLocalStorage(
            "generalQuestions_" + success.result["assessment"]["submissionId"],
            generalQuestions
          );
          this.localStorage.setLocalStorage(
            "generalQuestionsCopy_" +
              success.result["assessment"]["submissionId"],
            generalQuestions
          );
          programs[programIndex].solutions[assessmentIndex].entities[
            entityIndex
          ].downloaded = true;
          programs[programIndex].solutions[assessmentIndex].entities[
            entityIndex
          ].submissionId = success.result.assessment.submissionId;
          /*   await this.ulsdp.updateSubmissionIdArr(
            success.result.assessment.submissionId,
            solutionId,
            entityId
          ); */
          await this.ulsdp.updateSubmissionIdArr(
            success.result.assessment.submissionId
          );
          this.localStorage.setLocalStorage(
            this.utils.getAssessmentLocalStorageKey(
              programs[programIndex].solutions[assessmentIndex].entities[
                entityIndex
              ].submissionId
            ),
            success.result
          );
          this.localStorage.setLocalStorage(storageKeys.programList, programs);
          this.utils.stopLoader();

          resolve(programs);
        },
        (error) => {
          //console.log("error details api")
          this.utils.stopLoader();
          reject();
        },
        { version: "v2" }
      );
    });
  }

  // for observation

  getAssessmentDetailsForObservation(event, programs) {
    return new Promise((resolve, reject) => {
      // let programIndex = event.programIndex;
      let programIndex = event.programIndex;
      let solutionIndex = event.solutionIndex;
      let entityIndex = event.entityIndex;
      // let schoolIndex = event.entityIndex;
      let submissionNumber = event.submission.submissionNumber;
      // let submissionId = event.submission.submissionId;
      let observationId = event.submission.observationId;

      this.utils.startLoader();
      const url =
        AppConfigs.cro.observationDetails +
        observationId +
        "?entityId=" +
        programs[programIndex].solutions[solutionIndex].entities[entityIndex]
          ._id +
        "&submissionNumber=" +
        submissionNumber;
      console.log(url);
      this.apiService.httpGet(
        url,
        (success) => {
          this.ulsdp.mapSubmissionDataToQuestion(success.result, true);
          const generalQuestions = success.result["assessment"][
            "generalQuestions"
          ]
            ? success.result["assessment"]["generalQuestions"]
            : null;
          this.localStorage.setLocalStorage(
            "generalQuestions_" + success.result["assessment"]["submissionId"],
            generalQuestions
          );
          this.localStorage.setLocalStorage(
            "generalQuestionsCopy_" +
              success.result["assessment"]["submissionId"],
            generalQuestions
          );

          /* programs[programIndex].solutions[assessmentIndex].entities[
            entityIndex
          ].submissions.map((s) => {
            s.submissionNumber == submissionNumber
              ? (s.downloaded = true)
              : null;
          }); */

          this.ulsdp.storeObsevationSubmissionId(
            success.result["assessment"]["submissionId"]
          );

          this.localStorage.setLocalStorage(
            this.utils.getAssessmentLocalStorageKey(
              success.result.assessment.submissionId
            ),
            success.result
          );
          this.localStorage.setLocalStorage(storageKeys.programList, programs);
          this.utils.stopLoader();
          resolve(programs);
        },
        (error) => {
          //console.log("error details api")
          this.utils.stopLoader();
          reject();
        },
        { version: "v2" }
      );
    });
  }

  refreshObservationList(programs?: any, event?) {
    return new Promise((resolve, reject) => {
      /*  let programIndex = event.programIndex;
      let solutionIndex = event.solutionIndex;
      let entityIndex = event.entityIndex; */
      /* let prevlist = programs[programIndex].solutions[solutionIndex].entities[
        entityIndex
      ].submissions.filter((s) => s.downloaded); */

      //
      this.apiService.httpGet(
        AppConfigs.programs.programList,
        (success) => {
          let currList = success.result;

          this.localStorage.setLocalStorage(storageKeys.programList, currList);
          resolve(currList);
        },
        (error) => {
          // event ? event.complete() : "";
          reject();
        }
      );
      //
    });
  }

  openMenu(event, programs, showMenu?: any) {
    let myEvent = event.event;
    let programIndex = event.programIndex;
    let assessmentIndex = event.assessmentIndex;
    let entityIndex = event.entityIndex;
    let submissionId = event.submissionId;
    let showMenuArray;
    let solutionId = event.solutionId;
    let parentEntityId = event.parentEntityId;
    let createdByProgramId = event.createdByProgramId;

    this.localStorage
      .getLocalStorage(this.utils.getAssessmentLocalStorageKey(submissionId))
      .then((successData) => {
        if (showMenu) {
          showMenuArray = successData.solution.registry;
        } else {
          showMenuArray = [];
        }

        let popover = this.popoverCtrl.create(MenuItemComponent, {
          submissionId:
            programs[programIndex].solutions[assessmentIndex].entities[
              entityIndex
            ].submissionId,
          _id:
            programs[programIndex].solutions[assessmentIndex].entities[
              entityIndex
            ]["_id"],
          name:
            programs[programIndex].solutions[assessmentIndex].entities[
              entityIndex
            ]["name"],
          programId: programs[programIndex]._id,
          showMenuArray: showMenuArray,
          solutionId: solutionId,
          parentEntityId: parentEntityId,
          createdByProgramId: createdByProgramId,
        });
        popover.present({
          ev: myEvent,
        });
      })
      .catch((error) => {});
  }

  /* 
    only for migration purpose to make downloaded = true for already downloaded entities in 
    previous app version before flow change 
  */

  // pass the program list and check for institutional,individual list
  migrationFuntion(program) {
    let intstitutionalList = this.localStorageGetfn(
      storageKeys.institutionalList
    );
    let individualList = this.localStorageGetfn(storageKeys.individualList);

    intstitutionalList
      .then((list) => {
        console.log(list);
        // this.migrate(list, program, "institutionalList");
        this.migrate(list, "institutionalList");
      })
      .catch((err) => {});

    individualList
      .then((list) => {
        console.log(list);
        // this.migrate(list, program, "individualList");
        this.migrate(list, "individualList");
      })
      .catch((err) => {});
    this.runObservationMigration();
  }

  runObservationMigration() {
    let idsArr = [];
    this.localStorageGetfn(storageKeys.createdObservationList)
      .then((list) => {
        console.log(list);
        list.map((program) =>
          program.entities.map((entity) =>
            entity.submissions.map((submission) => {
              submission.downloaded ? idsArr.push(submission._id) : null;
            })
          )
        );
        idsArr.length ? this.ulsdp.storeObsevationSubmissionId(idsArr) : null;
        this.localStorage.deleteOneStorage(storageKeys.createdObservationList);
      })
      .catch((err) => console.log(err));
  }

  // if individual,institutional list present get the data
  async localStorageGetfn(assessmentType) {
    return await this.localStorage.getLocalStorage(assessmentType);
  }

  // run migratation by providing previous list,current program list and the key in which previous list is stored
  // migrate(prevlist, currList, key) {
  migrate(list, key) {
    let idsArr = [];

    list.map((program) =>
      program.solutions.map((solution) =>
        solution.entities.map((entity) => {
          entity.downloaded ? idsArr.push(entity.submissionId) : null;
        })
      )
    );
    console.log(idsArr);
    idsArr.length ? this.ulsdp.updateSubmissionIdArr(idsArr) : null;

    // this.localStorageUpdateFn(currList, key);
    this.localStorageUpdateFn(key);
  }

  /* 
    update the current list i.e program list
    delete the previous list i.e institutional,individual lists
  */
  // localStorageUpdateFn(currList: any, key) {
  localStorageUpdateFn(key) {
    // this.localStorage.setLocalStorage(storageKeys.programList, currList);
    this.localStorage.deleteOneStorage(key);
  }

  /*----------------- migration steps end------------- */
}
