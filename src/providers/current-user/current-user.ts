import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import * as jwt_decode from "jwt-decode";
// import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

/*
  Generated class for the CurrentUserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CurrentUserProvider {

  public curretUser: any;

  constructor(private storage: Storage) {
    console.log('Hello CurrentUserProvider Provider');
  }

  setCurrentUserDetails(userTokens): void {
    let userDetails = jwt_decode(userTokens.accessToken);
    // let userId = userDetails.sub;
    // this.sqlite.create({
    //   name: userId+'.db',
    //   location: 'default'
    // }).then((db: SQLiteObject) => {
    //     db.executeSql('CREATE TABLE IF NOT EXIST session(rowId INTEGER PRIMARY KEY, idToken TEXT, accessToken TEXT, refreshToken TEXT)')
    //       .then(() => {
    //         db.executeSql('INSERT INTO session (idToken, accessToken, refreshToken) VALUES (userDetails.idToken, userDetails.accessToken, userDetails.refreshToken)')
    //         .then(()=>{
    //           console.log("user data added");
    //         })
    //       })
    //       .catch(e => console.log(e));
    //   })
    //   .catch(e => console.log(e));
    this.curretUser = userTokens;
    this.storage.set('tokens', JSON.stringify(userTokens));
  }

  getCurrentUserData(): any {
    // this.storage.get('tokens').then((session) => {
    //   console.log(session);
    //   return session
    // });
    return jwt_decode(this.curretUser.accessToken)
  }

  removeUser() {
    this.storage.remove('tokens');
    this.storage.remove('schools');
    this.storage.remove('images');
  }

  fetchUser(): void {
    this.storage.get('tokens').then((session) => {
      this.curretUser = JSON.parse(session);
      return JSON.parse(session)
    });
  }

  checkForTokens(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.get('tokens').then((tokens) => {
        console.log("heree")
        if (tokens) {
          this.curretUser = JSON.parse(tokens);
          resolve();
        } else {
          reject();
        }
      });
    })
  }

  checkForValidToken(): Promise<any> {
    console.log('check for token')
    return new Promise((resolve, reject) => {
      this.storage.get('tokens').then((tokens) => {
        console.log("check token promise" + tokens);
        if (tokens) {
          console.log('in if token');
          let current_tokens = JSON.parse(tokens);
          let access_token = jwt_decode(current_tokens.accessToken);
          let access_token_expire_time = parseInt(access_token.exp);
          console.log(access_token_expire_time + ' ' + Date.now() + ' ' + (access_token_expire_time > Date.now()));
          if (access_token_expire_time > (Date.now() / 1000)) {
            resolve("Valid token")
          } else {
            console.log("invalid Valid token");
            reject("Problem authenticating with Sunbird");
          }
        } else {
          console.log("no token");
          reject("Problem authenticating with Sunbird");
        }
        // this.curretUser = JSON.parse(session);
        // return JSON.parse(session)
      });

    });
  }

  refreshToken() {

  }
}
