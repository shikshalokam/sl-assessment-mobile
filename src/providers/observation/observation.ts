import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageProvider } from '../local-storage/local-storage';
import { Events } from 'ionic-angular';

/*
  Generated class for the ObservationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ObservationProvider {

  constructor(public http: HttpClient, private localstorage: LocalStorageProvider, private events: Events) {
    console.log('Hello ObservationProvider Provider');
  }

  markObservationAsCompleted(submissionId) {
    this.localstorage.getLocalStorage('createdObservationList').then(observations => {
      for (const observation of observations) {
        for (const entity of observation.entities) {
          if (entity.submissionId === submissionId) {
            console.log(JSON.stringify(entity))
            entity.submissionStatus = 'completed';
          }
        }
      }

      this.localstorage.setLocalStorage('createdObservationList', observations);
      this.events.publish('observationLocalstorageUpdated');
    }).catch(error => {

    })
  }

}
