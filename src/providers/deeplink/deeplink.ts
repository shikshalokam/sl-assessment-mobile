import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiProvider } from "../api/api";
import { AppConfigs } from "../appConfig";

/*
  Generated class for the DeeplinkProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DeeplinkProvider {
  constructor(public http: HttpClient, public apiProvider: ApiProvider) {
    console.log("Hello DeeplinkProvider Provider");
  }

  createObsFromLink(link) {
    const url = AppConfigs.deeplink.createObservationByLink;
    let body = {
      link: link,
    };

    return new Promise((resolve, reject) => {
      this.apiProvider.httpPost(
        url,body,
        (success) => {
          resolve(success);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
}
