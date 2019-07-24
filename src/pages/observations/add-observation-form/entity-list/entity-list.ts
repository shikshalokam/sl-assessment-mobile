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
  observationId;
  searchUrl;
  selectableList: any;
  index: any = 50;
  list: any = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCntrl: ViewController,
    private apiProviders: ApiProvider,
    private utils: UtilsProvider
  ) {
    this.searchUrl = AppConfigs.cro.searchEntity;
    this.observationId = this.navParams.get('data');
    console.log(this.observationId)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SchoolListPage');

  }


  addSchools() {
    let selectedSchools = []
    this.selectableList.forEach(element => {
      if (element.selected) {
        selectedSchools.push(element);
      }
    });
    console.log(selectedSchools.length);
    this.viewCntrl.dismiss(selectedSchools);

  }

  search(event) {
    this.index =50;
    this.utils.startLoader();
    this.apiProviders.httpGet(this.searchUrl + this.observationId + "?search=" + event, success => {
      this.utils.stopLoader();

      let arr = [];
      for (let i = 0; i < success.result[0].metaInformation.length; i++) {
        if (!success.result[0].metaInformation[i].selected) {
          arr.push(success.result[0].metaInformation[i])
        }
      }
      this.selectableList = arr
      // this.selectableList.forEach( element =>{
      //   element.selected = false;
      // } )
      this.index = this.index > this.selectableList.length ? this.selectableList.length : this.index;
      this.list = this.selectableList.slice(0, this.index);
    }, error => {
      this.utils.stopLoader();

    })
  }

}
