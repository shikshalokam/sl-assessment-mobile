import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../../providers/api/api';
import { FormGroup } from '@angular/forms';
import { UtilsProvider } from '../../../providers/utils/utils';

@IonicPage()
@Component({
  selector: 'page-add-observation',
  templateUrl: 'add-observation.html',
})
export class AddObservationPage {
  addObservationData : {};
  addObservationForm : FormGroup;
  listOfFrameWork = [
    [ 
      1 , 2 ,3 ,4 ,5 ,6 ,7
    ],
    [
      'A' , 'B' , 'C' , 'D' ,'E'
    ]
  ]
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public apiProviders : ApiProvider,
    public utils : UtilsProvider
     ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddObservationPage');
    this.apiProviders.getLocalJson('assets/addObservation.json' ).subscribe( successData => {
      this.addObservationData = JSON.parse(successData['_body']).form;
      console.log(JSON.stringify(this.addObservationData) );

      this.addObservationForm = this.utils.createFormGroup(this.addObservationData);
    } ,
    error =>{

    })
  }

  saveDraft(){

  }
  addObservation(){

  }

}
