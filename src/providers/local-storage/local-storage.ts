import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class LocalStorageProvider {

  constructor(public http: HttpClient, private storage: Storage) {
    console.log('Hello LocalStorageProvider Provider');
  }

  setLocalStorage(key, value) {
    this.storage.set(key, value)
  }

  getLocalStorage(key) : Promise<any>{
    console.log(key)
    return new Promise((resolve, reject) => {
      this.storage.get(key).then( data => {
        if(data) {
          resolve(data)
        } else {
          reject()
        }
      }).catch(error => {
        reject(error)
      })
    })
  }

}
