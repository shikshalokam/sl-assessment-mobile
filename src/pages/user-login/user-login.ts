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
  adminToken: any;

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

  goToForgotPassword() {
    this.navCtrl.push(ForgotPasswordPage);
  }

  // only using this to login now .
  loginNew() {
    this.utils.startLoader();

    const url = AppConfigs.user_management_base_url + AppConfigs.punjab.staffLogin;
    const payload = this.signIn.value;
    this.http.post(url, payload).subscribe(
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