import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiProvider } from "../../providers/api/api";
import { LocalStorageProvider } from "../../providers/local-storage/local-storage";
import { UtilsProvider } from "../../providers/utils/utils";
import { AppConfigs } from "../../providers/appConfig";

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
    private utils: UtilsProvider
  ) {
    console.log("Hello ProgramProvider Provider");
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
          for (const program of successData.result) {
            for (const solution of program.solutions) {
              for (const entity of solution.entities) {
                entity.downloaded = false;
                entity.submissionId = null;
              }
            }
          }

          this.localStorage.setLocalStorage(`programList`, successData.result);
          // console.log(JSON.stringify(programs))
          resolve(successData.result);
        },
        (error) => {
          //console.log("error in list of assessment")
          // this.utils.stopLoader();
          !noLoader ? this.utils.stopLoader() : null;

          //TODO Delete this below
          const successData = {};
          successData["result"] = [
            {
              _id: "5cfa4ebcfc7cae61da9add8b",
              externalId: "Test-Program",
              name: "Test",
              description: "Test",
              solutions: [
                {
                  _id: "5ebcd4b01fd0ae7608286605",
                  externalId: "Test-solutions",
                  name: "Test",
                  description: "Test",
                  type: "assessment",
                  subType: "institutional",
                  entities: [
                    {
                      _id: "5cfe1f29f5fcff1170088cf3",
                      submissionId: "5ec3a24b2ac20b6825930d8a",
                      submissionStatus: "completed",
                      externalId: "3020509002",
                      name: "Test-school",
                      city: "KOTLI DHOLE SHAH",
                      state: "Punjab",
                    },
                  ],
                },
              ],
            },
          ];
          for (const program of successData["result"]) {
            for (const solution of program.solutions) {
              for (const entity of solution.entities) {
                entity.downloaded = false;
                entity.submissionId = null;
              }
            }
          }
          this.localStorage.setLocalStorage(
            `programList`,
            successData["result"]
          );

          //TODO delete above

          reject();
        }
      );
    });
  }
}
