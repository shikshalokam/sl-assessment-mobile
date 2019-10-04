import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UtilsProvider } from '../../providers/utils/utils';
import { AppConfigs } from '../../providers/appConfig';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';


@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})
export class ResetPasswordPage {
  private resetPasswordForm: FormGroup;
  counter = 0;
  payload = {}
  password;
  oldPassword;
  confirmPassword;
  userDetails;
  partnerDetails;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private formBuilder: FormBuilder, private http: HttpClient, private utils: UtilsProvider,
    private localStorage: LocalStorageProvider) {
    this.resetPasswordForm = this.formBuilder.group({
      oldPassword: new FormControl('', [Validators.required, Validators.maxLength(35)]),
      password: new FormControl('', [Validators.required, Validators.maxLength(35)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.maxLength(35)]),
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
    this.localStorage.getLocalStorage('partnerLoginDetails').then(data => {
      this.partnerDetails = data;
    }).catch(error => {

    })
  }

  encryptParams(stringToEncrypt) {
    if (this.counter === 0) {
      this.utils.startLoader()
    }
    const params = new HttpParams({
      fromObject: {
        'values': stringToEncrypt ? stringToEncrypt : this.resetPasswordForm.value.password,
        'key': AppConfigs.punjabApiKey
      }
    });

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      })
    };

    this.http.post(AppConfigs.punjabBaseUrl + AppConfigs.punjab.encryptedMethod, params, httpOptions).subscribe(success => {
    }, error => {
      let encryptedString = (error.error.text.split('<string xmlns="http://tempuri.org/">'))[1].split('</string>')[0];
      if (this.counter === 0) {
        this.password = encryptedString
        this.counter++;
        this.encryptParams(this.resetPasswordForm.value.confirmPassword)
      } else if (this.counter === 1) {
        this.confirmPassword = encryptedString
        this.counter++;
        this.encryptParams(this.resetPasswordForm.value.oldPassword)
      } else if (this.counter === 2) {
        this.oldPassword = encryptedString
        this.counter++;
        this.encryptParams(this.partnerDetails.facultyCode)
      } else {
        this.payload = {
          password: this.password,
          confirmPassword: this.confirmPassword,
          oldPassword: this.oldPassword,
          key: AppConfigs.punjabApiKey,
          facultyCode: encryptedString
        };
        this.counter = 0;
        console.log(JSON.stringify(this.payload))
        this.resetPassword();
      }
    })

  }

  resetPassword() {
    const params = new HttpParams({
      fromObject: {
        password: this.password,
        oldPassword: this.oldPassword,
        confirmPassword: this.confirmPassword,
        facultyCode: this.payload['facultyCode'],
        key: AppConfigs.punjabApiKey
      }
    });


    console.log(JSON.stringify(params))
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      })
    };
    this.http.post(AppConfigs.punjabBaseUrl + AppConfigs.punjab.resetPassword, params, httpOptions).subscribe(success => {
    }, error => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(error.error.text, "text/xml");
      this.utils.stopLoader();
      try {
        this.userDetails = JSON.parse(xmlDoc.getElementsByTagName('string')[0].childNodes[0].nodeValue)[0];
      } catch (e) {
        // console.log(xmlDoc.getElementsByTagName('string')[0].childNodes[0].nodeValue)
        // JSON.parse(xmlDoc.getElementsByTagName('string')[0].childNodes[0].nodeValue, (key, value) =>
        //  {console.log(key);
        //  console.log(value)
        //  }
        // );
        // this.utils.stopLoader();
        console.log(xmlDoc.getElementsByTagName('string')[0].childNodes[0].nodeValue);
        if (xmlDoc.getElementsByTagName('string')[0].childNodes[0].nodeValue.indexOf('Password & confirm password is not same !!!') >= 0) {
          this.utils.openToast("Password & confirm password is not same !!!");

        } else if (xmlDoc.getElementsByTagName('string')[0].childNodes[0].nodeValue.indexOf('Your password has chanced !!!') >= 0) {
          this.utils.openToast("Your password has been changed");
          this.navCtrl.pop();
        } else {
          this.utils.openToast("Invalid password.");
        }
      }
    })
  }

}
