import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Http, URLSearchParams } from '@angular/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CurrentUserProvider } from '../current-user/current-user';
import { AppConfigs } from '../appConfig';
import { AuthProvider } from '../auth/auth';

@Injectable()
export class HttpInterceptorProvider implements HttpInterceptor {

  constructor(public currentUser: CurrentUserProvider, private auth: AuthProvider,
    private http: Http) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // const userDetails = this.currentUser.getCurrentUserData();
    // console.log('interceptor: ' + userDetails.exp + ' ' + Date.now());
    // if (userDetails.exp > (Date.now() / 1000)) {
    //   console.log('valid token');
    //   console.log(JSON.stringify(request));
    console.log("Interceptor: in");
    if (request.url.indexOf('realms') === -1) {
      console.log("Interceptor: assesor API");
      request = request.clone({
        setHeaders: {
          // Authorization: `Bearer ${AppConfigs.api_key}`,
          'x-authenticated-user-token': this.currentUser.curretUser.accessToken
        }
      });
    }

    return next.handle(request);
    // } 
    // else {
    //   console.log("Else condition");

    //   const body = new URLSearchParams();
    //   body.set('grant_type', "refresh_token");
    //   body.set('client_id', "sl-ionic-connect");
    //   body.set('refresh_token', this.currentUser.curretUser.refreshToken);
    //   // body.set('scope', "offline_access");
    //   //console.log('refresh_token ' + this.currentUser.curretUser)
    //   //console.log(this.currentUser.curretUser.refreshToken);
    //   console.log(AppConfigs.app_url + AppConfigs.keyCloak.getAccessToken);
    //   // console.log(request)


    //   this.http.post(AppConfigs.app_url + AppConfigs.keyCloak.getAccessToken, body)
    //     .subscribe((data: any) => {
    //       console.log('new access token');
    //       // console.log(JSON.stringify(data))
    //       // console.log(JSON.parse(data._data));
    //       let parsedData = JSON.parse(data._body);
    //       // console.log(JSON.stringify(parsedData))
    //       let userTokens = {
    //         accessToken: parsedData.access_token,
    //         refreshToken: parsedData.refresh_token,
    //         idToken: parsedData.id_token
    //       };
    //       this.currentUser.setCurrentUserDetails(userTokens);
    //       request = request.clone({
    //         setHeaders: {
    //           'x-authenticated-user-token': userTokens.accessToken
    //         }
    //       });
    //       console.log("Set header");
    //       return next.handle(request);
    //     }, error => {
    //       console.log('logiut invalid token');
    //       console.log('error ' + JSON.stringify(error));
    //       // reject();
    //     })
    //   // this.auth.getRefreshToken().then(response => {
    //   //   console.log('new access token');
    //   //   request = request.clone({
    //   //     setHeaders: {
    //   //       // Authorization: `Bearer ${AppConfigs.api_key}`,
    //   //       'x-authenticated-user-token': response.accessToken
    //   //     }
    //   //   });
    //   //   return next.handle(request);
    //   // }).catch(error => {
    //   //   console.log('invalid token, Logout');
    //   // })
    // }



  }
}
