import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { Validators, FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { UtilsProvider } from "../../providers/utils/utils";
import { AppConfigs } from "../../providers/appConfig";

@Component({
  selector: "page-forgot-password",
  templateUrl: "forgot-password.html",
})
export class ForgotPasswordPage {
  private forgotPasswordForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private utils: UtilsProvider
  ) {
    this.forgotPasswordForm = this.formBuilder.group({
      staffID: ["", Validators.required],
      registeredMobileNo: new FormControl("", [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
      ]),
    });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ForgotPasswordPage");
  }

  forgetPassword() {
    let payload = this.forgotPasswordForm.value;
    let url = AppConfigs.user_management_base_url + AppConfigs.punjab.forgotPasswordNew;
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
