import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageProvider } from '../local-storage/local-storage';

/*
  Generated class for the ObservationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ObservationProvider {

  constructor(public http: HttpClient, private localstorage: LocalStorageProvider) {
    console.log('Hello ObservationProvider Provider');
  }

  markObservationAsCompleted(submissionId) {
    console.log("innnn")
    this.localstorage.getLocalStorage('createdObservationList').then(observations => {
      for (const observation of observations) {
        for (const entity of observation.entities) {
          if (entity.submissionId === submissionId) {
            console.log(JSON.stringify(entity))
            entity.submissionStatus = 'completed';
          }
        }
      }
      this.localstorage.setLocalStorage('createdObservationList', observations)
    }).catch(error => {

    })
  }

}
