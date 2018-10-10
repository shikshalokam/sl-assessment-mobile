import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
/**
 * Generated class for the MatrixActionModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-matrix-action-modal',
  templateUrl: 'matrix-action-modal.html',
})
export class MatrixActionModalPage {

  instanceDetails: any;
  selectedIndex: any;
  data: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCntrl: ViewController) {
    this.selectedIndex = navParams.data.selectedIndex;
    const data = navParams.data.data;
    this.data = Object.assign(data);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MatrixActionModalPage');
  }

  update() {
    this.viewCntrl.dismiss(this.data)
  }

}
