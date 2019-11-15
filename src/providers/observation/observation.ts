import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageProvider } from '../local-storage/local-storage';
import { Events } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';
import { ApiProvider } from '../api/api';
import { AppConfigs } from '../appConfig';


@Injectable()
export class ObservationProvider {

  observationListUpdate = new Subject();

  constructor(
    public http: HttpClient, 
    private localstorage: LocalStorageProvider, 
    private events: Events,
    private apiProviders:ApiProvider
    ) {
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


  getObservationListFromLocal() {
    return new Promise((resolve, reject) => {
      this.localstorage.getLocalStorage('').then(success => {
        if (success) {
          resolve(success)
        } else {
          reject();
        }
      }).catch(error => {
        reject();

      })
    })
  }

  updateObservationLocalStorage() {
    console.log("inside subject ")
    // this.apiProviders.httpGet(AppConfigs.cro.observationList, success => {
    this.observationListUpdate.next()
  }




}
