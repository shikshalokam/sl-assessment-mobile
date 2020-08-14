import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { storageKeys } from "../../../../providers/storageKeys";
import { LocalStorageProvider } from "../../../../providers/local-storage/local-storage";

/*
  Generated class for the PollProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PollProvider {
  deleteDraft(draftTime: any) {
    return this.getPollDraft()
      .then((allDraft) => allDraft.filter((d) => d.time !== draftTime))
      .then((allDraft) => this.savePollDraft(allDraft))
      .catch((err) => {});
  }
  savePollDraft(value: any) {
    return this.localStorage.setLocalStorage(storageKeys.pollDraft, value);
  }

  getPollDraft() {
    return this.localStorage
      .getLocalStorage(storageKeys.pollDraft)
      .then((items) => {
        return items;
      })
      .catch(() => {
        this.localStorage.setLocalStorage(storageKeys.pollDraft, []);
        return [];
      });
  }

  constructor(public http: HttpClient, public localStorage: LocalStorageProvider) {
    console.log("Hello PollProvider Provider");
  }
}
