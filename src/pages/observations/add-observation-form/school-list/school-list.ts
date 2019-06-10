import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the SchoolListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-school-list',
  templateUrl: 'school-list.html',
})
export class SchoolListPage {
schoolList;
index;
schools;
  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
     public viewCntrl :ViewController
     ) {
    this.schoolList = this.navParams.get('schoolList');
    this.schools = this.navParams.get('schools');
    this.index = this.navParams.get('index');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SchoolListPage');
    console.log(this.schools.length);
    console.log(this.schoolList.length);
    console.log(this.index);
  }

  
  addSchools(){
    let selectedSchools = []
    this.schoolList.forEach(element => {
      if(element.selected){
        selectedSchools.push(element);
      }
    });
    console.log(selectedSchools.length);
    this.viewCntrl.dismiss(selectedSchools);

  }
  

}
