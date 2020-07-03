import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppConfigs } from "../../../providers/appConfig";
import { ApiProvider } from "../../../providers/api/api";
import { UtilsProvider } from "../../../providers/utils/utils";
import { LocalStorageProvider } from "../../../providers/local-storage/local-storage";
import { storageKeys } from "../../../providers/storageKeys";

/*
  Generated class for the LibraryProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LibraryProvider {
  constructor(
    public http: HttpClient,
    public apiService: ApiProvider,
    public utils: UtilsProvider,
    public localStorage: LocalStorageProvider
  ) {
    console.log("Hello LibraryProvider Provider");
  }
  getUrl(type, list?) {
    switch (type) {
      case "observation":
        return list
          ? AppConfigs.library.observationSolutionsList
          : AppConfigs.library.observationTemplateDetail;
      case "individual":
        return list
          ? AppConfigs.library.individualSolutionsList
          : AppConfigs.library.individualTemplateDetail;
      case "institutional":
        return list
          ? AppConfigs.library.institutionalSolutionsList
          : AppConfigs.library.institutionalTemplateDetail;

      default:
        break;
    }
  }
  getObservationSolutionsList(type, search, page) {
    search.length ? null : this.utils.startLoader();
    const url =
      this.getUrl(type, "list") + `?search=${search}&page=${page}&limit=10`;
    return new Promise((resolve, reject) => {
      this.apiService.httpGet(
        url,
        (successData) => {
          search.length ? null : this.utils.stopLoader();
          resolve(successData.result);
        },
        (error) => {
          search.length ? null : this.utils.stopLoader();
          reject();
        }
      );
    });
  }

  getSolutiontemplate(solutionId, type) {
    this.utils.startLoader();
    const url = this.getUrl(type) + solutionId;
    return new Promise((resolve, reject) => {
      this.apiService.httpGet(
        url,
        (successData) => {
          this.utils.stopLoader();
          resolve(successData.result);
        },
        (error) => {
          this.utils.stopLoader();
          reject();
        }
      );
    });
  }

  getSolutionMetaForm(solutionId, type) {
    this.utils.startLoader();
    const url =
      type == "observation"
        ? AppConfigs.cro.getCreateObservationMeta + solutionId
        : AppConfigs.library.assessmentMeta + solutionId;

    return new Promise((resolve, reject) => {
      this.apiService.httpGet(
        url,
        (successData) => {
          this.utils.stopLoader();
          resolve(successData.result);
        },
        (error) => {
          this.utils.stopLoader();
          reject();
        }
      );
    });
  }

  /* OA-Observation and assessment (individual and institutional) */
  createOA(payload, solutionId, type) {
    const url =
      type == "observation"
        ? AppConfigs.cro.createObservation + solutionId
        : AppConfigs.library.createAssessment + solutionId;

    return new Promise((resolve, reject) => {
      this.apiService.httpPost(
        url,
        payload,
        (success) => {
          this.utils.openToast(success.message);
          resolve(success);
        },
        (error) => {
          reject();
        },
        type == "observation" ? { version: "v2" } : { version: "v1" }
      );
    });
  }

  getPrivateProgram() {
    return new Promise((resolve, reject) => {
      const url = AppConfigs.library.privateProgram;

      this.apiService.httpGet(
        url,
        (successData) => {
          resolve(successData.result);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getLibraryDraft() {
    return this.localStorage
      .getLocalStorage(storageKeys.libraryDraft)
      .then((items) => {
        return items;
      })
      .catch((err) => {
        this.localStorage.setLocalStorage(storageKeys.libraryDraft, []);
        return [];
      });
  }

  saveLibraryDraft(value) {
    return this.localStorage.setLocalStorage(storageKeys.libraryDraft, value);
  }

  deleteDraft(draftTime: any) {
    return this.getLibraryDraft()
      .then((allDraft) => allDraft.filter((d) => d.time !== draftTime))
      .then((allDraft) => this.saveLibraryDraft(allDraft))
      .catch((err) => {});
  }
}
