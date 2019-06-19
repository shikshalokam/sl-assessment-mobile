import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the SchoolListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-entity-list',
  templateUrl: 'entity-list.html',
})
export class EntityListPage {
entityList;

  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
     public viewCntrl :ViewController
     ) {
   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SchoolListPage');

  }

  
  addSchools(){
    let selectedSchools = []
    this.entityList.forEach(element => {
      if(element.selected){
        selectedSchools.push(element);
      }
    });
    console.log(selectedSchools.length);
    this.viewCntrl.dismiss(selectedSchools);

  }
  

}
