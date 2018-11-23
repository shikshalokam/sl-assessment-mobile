import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams , ViewController} from 'ionic-angular';

@Component({
  selector: 'page-remarks',
  templateUrl: 'remarks.html',
})
export class RemarksPage {
  @ViewChild('remarkInput') remarkInput;

  data: any;
  button: string;
  required: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
    this.data = this.navParams.get('data');
    this.button = this.navParams.get('button') ? this.navParams.get('button') : "save";
    this.required = this.navParams.get('required');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RemarksPage');
  }

  update(): void {
    this.viewCtrl.dismiss(this.data.remarks);
  }
  ngAfterViewChecked() {
    this.remarkInput.setFocus()
  }

  close(): void {
    this.viewCtrl.dismiss();
  }

}
