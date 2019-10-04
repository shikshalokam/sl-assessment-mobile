import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup , FormControl} from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UtilsProvider } from '../../providers/utils/utils';
import { AppConfigs } from '../../providers/appConfig';


@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {
  private forgotPasswordForm: FormGroup;
  counter = 0;
  payload = {}
  staffID;
  userDetails;

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, private http: HttpClient, private utils: UtilsProvider, ) {
    this.forgotPasswordForm = this.formBuilder.group({
      staffID: ['', Validators.required],
      registeredMobileNo: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }

  encryptParams(stringToEncrypt) {
    if (this.counter === 0) {
      this.utils.startLoader()
    }
    const params = new HttpParams({
      fromObject: {
        'values': stringToEncrypt ? stringToEncrypt : this.forgotPasswordForm.value.staffID,
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
        this.staffID = encryptedString
        this.counter++;
        this.encryptParams(this.forgotPasswordForm.value.registeredMobileNo)
      } else {
        this.payload = {
          staffID: this.staffID,
          registeredMobileNo: encryptedString,
          key: AppConfigs.punjabApiKey
        };
        this.counter = 0;
        this.getPassword();
      }
    })

  }

  getPassword() {
    const params = new HttpParams({
      fromObject: {
        staffID: this.payload['staffID'],
        registeredMobileNo: this.payload['registeredMobileNo'],
        key: AppConfigs.punjabApiKey
      }
    });
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      })
    };
    this.http.post(AppConfigs.punjabBaseUrl + AppConfigs.punjab.forgotPassword, params, httpOptions).subscribe(success => {
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
        if (xmlDoc.getElementsByTagName('string')[0].childNodes[0].nodeValue.indexOf('Invalid') >= 0) {
          this.utils.openToast("Invalid credentials");

        } else if(xmlDoc.getElementsByTagName('string')[0].childNodes[0].nodeValue.indexOf('sent') >= 0) {
          this.utils.openToast("Password has sent on your registered mobile number !!!");
          this.navCtrl.pop();
        }
      }
    })
  }


}
