import { Component } from "@angular/core";
import { NavController, NavParams, App } from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { AppConfigs } from "../../providers/appConfig";
import { Http, URLSearchParams } from "@angular/http";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { CurrentUserProvider } from "../../providers/current-user/current-user";
import { HomePage } from "../home/home";
import { UtilsProvider } from "../../providers/utils/utils";
import { ForgotPasswordPage } from "../forgot-password/forgot-password";
import { LocalStorageProvider } from "../../providers/local-storage/local-storage";
import { HTTP } from "@ionic-native/http";
import { FcmProvider } from "../../providers/fcm/fcm";
import { AuthProvider } from "../../providers/auth/auth";
import * as jwt_decode from "jwt-decode";
import { switchMap, catchError, flatMap, map, mergeMap } from "rxjs/operators";
import { Observable } from "rxjs/Observable";

@Component({
  selector: "page-user-login",
  templateUrl: "user-login.html",
})
export class UserLoginPage {
  private signIn: FormGroup;
  auth_url;
  counter = 0;
  paylod = {};
  password;
  staffID;
  adminToken;
  userDetails;
  isNewUser: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private utils: UtilsProvider,
    private auth: AuthProvider,
    private currentUser: CurrentUserProvider,
    private app: App,
    private navCtrl: NavController,
    private ionicHttp: HTTP,
    private localStorage: LocalStorageProvider,
    private fcm: FcmProvider
  ) {
    this.signIn = this.formBuilder.group({
      staffID: ["", Validators.required],
      password: ["", Validators.required],
    });
  }

  checkForKeycloakUser(username, password) {
    const params = new HttpParams({
      fromObject: {
        grant_type: "password",
        username: username,
        password: AppConfigs.adminCredentials.userPassword,
        client_id: AppConfigs.clientId,
        scope: "offline_access",
      },
    });

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded",
      }),
    };
    const url = AppConfigs.app_url + "/auth/realms/sunbird/protocol/openid-connect/token";
    this.http.post(url, params, httpOptions).subscribe(
      (data: any) => {
        if (this.isNewUser) {
          this.addUserToOrganization(data);
        } else {
          this.utils.stopLoader();
          this.auth.checkForCurrentUserLocalData(data);
        }
        // let userTokens = {
        //   accessToken: data.access_token,
        //   refreshToken: data.refresh_token,
        //   // idToken: data.id_token
        // };
        // this.currentUser.setCurrentUserDetails(userTokens).then(success => {
        //   this.fcm.registerDeviceID();
        //   let nav = this.app.getActiveNav();
        //   nav.setRoot(HomePage);
        // })
      },
      (error) => {
        this.adminLogin();
      }
    );
  }

  addUserToOrganization(userDetails) {
    console.log("inside add user to organisation");
    const url = AppConfigs.app_url + AppConfigs.keyCloak.addUser;
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "X-authenticated-user-token": this.adminToken,
        Authorization: AppConfigs.adminCredentials.auterizationToken,
      }),
    };
    const userId = userDetails.access_token ? jwt_decode(userDetails.access_token).sub : "";
    const params = {
      params: {},
      request: {
        userId: userId,
        organisationId: AppConfigs.keyCloak.punjabOrgId,
        roles: AppConfigs.keyCloak.roles,
      },
    };
    this.http.post(url, params, httpOptions).subscribe(
      (data: any) => {
        this.utils.stopLoader();
        this.auth.checkForCurrentUserLocalData(userDetails);
        this.isNewUser = false;
      },
      (error) => {
        this.utils.stopLoader();
        this.utils.openToast("Unable to login. Please try again");
        this.isNewUser = true;
      }
    );
  }

  adminLogin() {
    const params = new HttpParams({
      fromObject: {
        grant_type: "password",
        username: AppConfigs.adminCredentials.username,
        password: AppConfigs.adminCredentials.password,
        client_id: AppConfigs.clientId,
      },
    });

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded",
      }),
    };
    const url = AppConfigs.app_url + "/auth/realms/sunbird/protocol/openid-connect/token";
    this.http.post(url, params, httpOptions).subscribe(
      (data: any) => {
        this.adminToken = data.access_token;
        this.createUser();
      },
      (error) => {
        console.log(JSON.stringify(error));
        this.utils.stopLoader();
        this.utils.openToast("Please try again.");
      }
    );
  }

  createUser() {
    const body = {
      params: {},
      request: {
        channel: AppConfigs.adminCredentials.adminChanel,
        firstName: this.userDetails.staffName,
        lastName: "",
        email: this.signIn.value.staffID + AppConfigs.adminCredentials.userEmailExtension,
        emailVerified: true,
        userName: this.signIn.value.staffID,
        password: AppConfigs.adminCredentials.userPassword,
      },
    };

    const url = AppConfigs.app_url + AppConfigs.punjab.createUser;

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "x-authenticated-user-token": this.adminToken,
        Authorization: AppConfigs.adminCredentials.auterizationToken,
      }),
    };

    this.http.post(url, body, httpOptions).subscribe(
      (data: any) => {
        this.isNewUser = true;
        this.checkForKeycloakUser(this.signIn.value.staffID, this.signIn.value.password);
      },
      (error) => {
        this.utils.stopLoader();
        this.utils.openToast("Invalid UserID & Password !!!");
      }
    );
  }

  logForm() {
    const params = new HttpParams({
      fromObject: {
        staffID: this.paylod["staffID"],
        password: this.paylod["password"],
        key: AppConfigs.punjabApiKey,
      },
    });
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded",
      }),
    };
    this.http.post(AppConfigs.punjabBaseUrl + AppConfigs.punjab.login, params, httpOptions).subscribe(
      (success) => {},
      (error) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(error.error.text, "text/xml");
        try {
          this.userDetails = JSON.parse(xmlDoc.getElementsByTagName("string")[0].childNodes[0].nodeValue)[0];
          this.localStorage.setLocalStorage("partnerLoginDetails", this.userDetails);
          this.checkForKeycloakUser(this.signIn.value.staffID, this.signIn.value.password);
        } catch (e) {
          this.utils.stopLoader();
          this.utils.openToast("Invalid UserID & Password !!!");
        }
      }
    );
  }

  login() {
    const payload = {
      staffID: this.paylod["staffID"],
      password: this.paylod["password"],
      key: AppConfigs.punjabApiKey,
    };
    const obj = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    this.ionicHttp.setDataSerializer("urlencoded");
    this.ionicHttp
      .post(AppConfigs.punjabBaseUrl + AppConfigs.punjab.login, payload, obj)
      .then((success) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(success.data, "text/xml");
        try {
          this.userDetails = JSON.parse(xmlDoc.getElementsByTagName("string")[0].childNodes[0].nodeValue)[0];
          this.localStorage.setLocalStorage("partnerLoginDetails", this.userDetails);
          this.checkForKeycloakUser(this.signIn.value.staffID, this.signIn.value.password);
        } catch (e) {
          this.utils.stopLoader();
          this.utils.openToast("Invalid UserID & Password !!!");
        }
      })
      .catch((error) => {
        this.signIn.reset();
        this.utils.stopLoader();
        this.paylod = {};
        console.log(JSON.stringify(error));
        this.staffID = "";
        this.utils.openToast(error.error);
      });
  }

  goToForgotPassword() {
    this.navCtrl.push(ForgotPasswordPage);
  }

  encryptParams(stringToEncrypt) {
    if (this.counter === 0) {
      this.utils.startLoader();
    }
    const payload = {
      values: stringToEncrypt ? stringToEncrypt : this.signIn.value.staffID,
      key: AppConfigs.punjabApiKey,
    };

    this.ionicHttp.setDataSerializer("urlencoded");

    this.ionicHttp
      .post(AppConfigs.punjabBaseUrl + AppConfigs.punjab.encryptedMethod, payload, {})
      .then((success) => {
        let encryptedString = success.data.split('<string xmlns="http://tempuri.org/">')[1].split("</string>")[0];
        if (this.counter === 0) {
          this.staffID = encryptedString;
          this.counter++;
          this.encryptParams(this.signIn.value.password);
        } else {
          this.paylod = {
            staffID: this.staffID,
            password: encryptedString,
            key: AppConfigs.punjabApiKey,
          };
          console.log(JSON.stringify(this.paylod));
          this.counter = 0;
          // this.isNewUser = true;
          this.login();
        }
      })
      .catch((error) => {
        this.utils.stopLoader();
        let errorMessage =
          error.status === 500 || error.status === 400
            ? error.error
            : "Unable to fetch user details. Please contact the support team for assistance.";
        this.utils.openToast(errorMessage);
      });
  }

  // only using this to login now .
  loginNew() {
    this.utils.startLoader();

    const params = new HttpParams({
      fromObject: {
        grant_type: "password",
        username: AppConfigs.adminCredentials.username,
        password: AppConfigs.adminCredentials.password,
        client_id: AppConfigs.clientId,
      },
    });

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded",
      }),
    };
    let url = AppConfigs.app_url + "/auth/realms/sunbird/protocol/openid-connect/token";
    this.http
      .post(url, params, httpOptions)
      .pipe(
        mergeMap((data: any) => {
          this.adminToken = data["access_token"];
          const httpOptions = {
            headers: new HttpHeaders({
              "Content-Type": "application/json",
              "x-authenticated-user-token": this.adminToken,
              Authorization: AppConfigs.adminCredentials.auterizationToken,
            }),
          };
          let payload = this.signIn.value;
          let url = AppConfigs.user_management_base_url + "v1" + AppConfigs.punjab.staffLogin;
          return this.http.post(url, payload, httpOptions);
        })
      )
      .subscribe(
        (res) => {
          console.log(res);
          this.utils.stopLoader();
          !res["result"] ? this.utils.openToast(res["message"]) : this.storeUserData(res["result"]);
        },
        (err) => {
          this.utils.stopLoader();
        }
      );
  }

  storeUserData(data) {
    this.localStorage.setLocalStorage("partnerLoginDetails", data);
    this.auth.checkForCurrentUserLocalData(data.tokenDetails);
  }
}
