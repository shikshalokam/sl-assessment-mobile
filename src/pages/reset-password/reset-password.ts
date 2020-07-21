import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { Validators, FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { UtilsProvider } from "../../providers/utils/utils";
import { AppConfigs } from "../../providers/appConfig";
import { LocalStorageProvider } from "../../providers/local-storage/local-storage";

@Component({
  selector: "page-reset-password",
  templateUrl: "reset-password.html",
})
export class ResetPasswordPage {
  private resetPasswordForm: FormGroup;
  counter = 0;
  payload = {};
  password;
  oldPassword;
  confirmPassword;
  userDetails;
  partnerDetails;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private utils: UtilsProvider,
    private localStorage: LocalStorageProvider
  ) {
    this.resetPasswordForm = this.formBuilder.group({
      oldPassword: new FormControl("", [Validators.required, Validators.maxLength(35)]),
      password: new FormControl("", [Validators.required, Validators.maxLength(35)]),
      confirmPassword: new FormControl("", [Validators.required, Validators.maxLength(35)]),
    });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ForgotPasswordPage");
    this.localStorage
      .getLocalStorage("partnerLoginDetails")
      .then((data) => {
        this.partnerDetails = data;
      })
      .catch((error) => {});
  }

  resetPasswordNew() {
    let payload = this.resetPasswordForm.value;
    payload.facultyCode = this.partnerDetails.facultyCode;
    let url = AppConfigs.user_management_base_url + "v1" + AppConfigs.punjab.resetPasswordNew;

    this.http.post(url, payload).subscribe(
      (res) => {
        this.utils.openToast(res["message"], "close");
        this.navCtrl.pop();
      },
      (err) => {
        this.utils.openToast("Please try again !!");
      }
    );
  }
}
