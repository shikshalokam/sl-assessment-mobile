import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AssessmentAboutPage } from '../../pages/assessment-about/assessment-about';

/**
 * Generated class for the GenericMenuPopOverComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'generic-menu-pop-over',
  templateUrl: 'generic-menu-pop-over.html'
})
export class GenericMenuPopOverComponent {

  text: string;
  showAbout = false;
  index ;
  type;
  constructor(private navCntrl : NavController , private navParams : NavParams) {
    console.log('Hello GenericMenuPopOverComponent Component');
    this.text = 'Hello World';
    this.showAbout  = this.navParams.get('showAbout')
    this.index  = this.navParams.get('index')
    this.type = this.navParams.get('type')
    console.log(this.showAbout)
  }
  goToAbout(){
    console.log("this is the index" + this.index)
    this.navCntrl.push(AssessmentAboutPage , {index : this.index  , type : this.type})

  }
}
