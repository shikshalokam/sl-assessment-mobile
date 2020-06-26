import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppConfigs } from "../../../providers/appConfig";
import { ApiProvider } from "../../../providers/api/api";
import { UtilsProvider } from "../../../providers/utils/utils";

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
    public utils: UtilsProvider
  ) {
    console.log("Hello LibraryProvider Provider");
  }

  getObservationSolutionsList() {
    this.utils.startLoader();
    return new Promise((resolve, reject) => {
      const url = AppConfigs.library.observationSolutionsList;

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

  getSolutiontemplate(solutionId) {
    this.utils.startLoader();
    return new Promise((resolve, reject) => {
      const url = AppConfigs.library.solutionTemplateDetail + solutionId;

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

  getObservationMetaForm(solutionId) {
    this.utils.startLoader();

    return new Promise((resolve, reject) => {
      const url = AppConfigs.cro.getCreateObservationMeta + solutionId;

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

  createObservation(payload, solutionId) {
    this.utils.startLoader();

    return new Promise((resolve, reject) => {
      const url = AppConfigs.cro.createObservation + solutionId;

      this.apiService.httpPost(
        url,
        payload,
        (success) => {
          this.utils.stopLoader();
          this.utils.openToast(success.message);
          resolve(success);
        },
        (error) => {
          this.utils.stopLoader();
          reject();
        },
        { version: "v2" }
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
          reject();
        }
      );
    });
  }
}
