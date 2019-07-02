import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { AppConfigs } from '../../../../providers/appConfig';
import { ApiProvider } from '../../../../providers/api/api';
import { UtilsProvider } from '../../../../providers/utils/utils';

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
observationId ;
searchUrl;
  selectableList: any;
  index: any = 100 ;
  list: any = [];
  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
     public viewCntrl :ViewController,
     private apiProviders : ApiProvider,
     private utils : UtilsProvider
     ) {
       this.searchUrl = AppConfigs.cro.searchEntity;
  this.observationId =  this.navParams.get('data');
  console.log(this.observationId)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SchoolListPage');

  }

  
  addSchools(){
    let selectedSchools = []
    this.selectableList.forEach(element => {
      if(element.selected){
        selectedSchools.push(element);
      }
    });
    console.log(selectedSchools.length);
    this.viewCntrl.dismiss(selectedSchools);

  }
  
  search(event){
    this.utils.startLoader();
    this.index = 100;
    this.apiProviders.httpGet(this.searchUrl+this.observationId+"?search="+event , success =>{
      let arr = [] ;
      for( let i = 0 ; i< success.result[0].metaInformation.length ; i++){
        if(!success.result[0].metaInformation[i].selected){
          arr.push(success.result[0].metaInformation[i])

        }
      }
      console.log(JSON.stringify(arr))
      this.selectableList =[...arr]
      // this.selectableList.forEach( element =>{
      //   element.selected = false;
      // } )
      // console.log(JSON.stringify(success.result[0]));

      // console.log(JSON.stringify(this.selectableList));
      // console.log("searched data");
      console.log( this.index > arr.length );
      this.index = this.index > arr.length ?  arr.length  : this.index;
      console.log(arr.length )
      console.log(this.index);
      this.list = [];
      this.list = this.selectableList.slice(0,this.index);
      // console.log(JSON.stringify(this.list))
    this.utils.stopLoader();

},error =>{
  this.utils.stopLoader();

    })
  }

}
