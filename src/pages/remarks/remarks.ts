import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams , ViewController} from 'ionic-angular';

@Component({
  selector: 'page-remarks',
  templateUrl: 'remarks.html',
})
export class RemarksPage {
  @ViewChild('remarkInput') remarkInput;
  data: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
    this.data = this.navParams.get('data');
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
