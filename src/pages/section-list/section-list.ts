import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the SectionListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-section-list',
  templateUrl: 'section-list.html',
})
export class SectionListPage {

  schoolSections: any;
  schoolName: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SectionListPage');
    let schoolId = this.navParams.get('_id');
    this.schoolName = this.navParams.get('name');
    let selectedEvidenceIndex = this.navParams.get('selectedEvidence');
    this.storage.get('schoolsDetails').then(data => {
      const schoolData = JSON.parse(data);
      this.schoolSections = schoolData[schoolId]['assessments'][selectedEvidenceIndex]['sections'];
      console.log(JSON.stringify(this.schoolSections))
    }).catch(error => {

    })
  }

}
