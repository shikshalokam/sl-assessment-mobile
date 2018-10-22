import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-flagging-modal',
  templateUrl: 'flagging-modal.html',
})
export class FlaggingModalPage {
  currentCriteria: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private viewCtrl: ViewController) {
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad FlaggingModalPage');
    this.currentCriteria = this.navParams.get('currentCriteria');
  }

  cancel() : void{
    this.viewCtrl.dismiss();
  }

  saveData(): void {
    if(this.currentCriteria.flag.value && this.currentCriteria.flag.remarks) {
      this.currentCriteria.isFlagged = true;
    } else {
      this.currentCriteria.isFlagged = false;
    }
    this.viewCtrl.dismiss(this.currentCriteria)
  }

}
