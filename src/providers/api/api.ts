import { Http, URLSearchParams, Headers } from '@angular/http';

import { Injectable } from '@angular/core';
import { CurrentUserProvider } from '../current-user/current-user';
import { AppConfigs } from '../appConfig';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

@Injectable()
export class ApiProvider {

  constructor(public http: Http, public currentUser: CurrentUserProvider) {
  }

  validateApiToken(): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log("Utils: validate token");
      const userDetails = this.currentUser.getCurrentUserData();
      console.log(userDetails.exp + ' ' + Date.now);
      if (userDetails.exp <= (Date.now() / 1000)) {
        console.log("Utils: invalid token")
        const body = new URLSearchParams();
        body.set('grant_type', "refresh_token");
        body.set('client_id', "sl-ionic-connect");
        body.set('refresh_token', this.currentUser.curretUser.refreshToken);
        console.log(this.currentUser.curretUser.refreshToken);
        const url = AppConfigs.app_url + AppConfigs.keyCloak.getAccessToken;
        console.log(url)

        this.http.post(url, body).subscribe((data: any) => {
          console.log("Utils: received validated token")
          console.log(data._body)
          let parsedData = JSON.parse(data._body);
          let userTokens = {
            accessToken: parsedData.access_token,
            refreshToken: parsedData.refresh_token,
            idToken: parsedData.id_token
          };
          this.currentUser.setCurrentUserDetails(userTokens);
          resolve()
        }, error => {
          this.currentUser.removeUser();
          console.log('Utils: Logout,token invalid');
          console.log('error ' + JSON.stringify(error));
          reject({ status: '401' });
        });
      } else {
        console.log("Utils: valid token")
        resolve();
      }
    })

  }

  httpPost(url, payload, successCallback, errorCallback) {
    let headers = new Headers();
    headers.append('x-authenticated-user-token', this.currentUser.curretUser.accessToken)
    this.validateApiToken().then(response => {
      return this.http.post(url, payload, { headers: headers })
    }).catch(error => {

    })
  }

  httpGet(url, successCallback, errorCallback) {
    this.validateApiToken().then(response => {
      console.log('SUCcess');
      let headers = new Headers();
      headers.append('x-authenticated-user-token', this.currentUser.curretUser.accessToken);
      console.log(AppConfigs.api_base_url + url)
      const apiUrl = AppConfigs.api_base_url + url;
      this.http.get(apiUrl, { headers: headers }).subscribe(data => {
        console.log('API service success')
        successCallback(JSON.parse(data['_body']));
      })
    }).catch(error => {
      console.log('ERRor')
      console.log(JSON.stringify(error))
      errorCallback(error);
    })
  }

  httpGetJoin(urls, successCallback) {
    console.log('Joiin');
    let requests = [];
    for (const url of urls) {
    console.log('url append');

      let req = this.http.get(AppConfigs.api_base_url + url);
      requests.push(req);
    }
    console.log(requests)
    this.validateApiToken().then(response => {
      Observable.forkJoin(requests).subscribe(response => {
        successCallback(response);
      })
    }).catch(error => {

    })

  }


} 
