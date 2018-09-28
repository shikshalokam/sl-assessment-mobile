import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,App} from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the EvidenceListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-evidence-list',
  templateUrl: 'evidence-list.html',
})
export class EvidenceListPage {

  schoolId: any;
  schoolName: string;
  schoolEvidences: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private storage: Storage, private appCtrl: App) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EvidenceListPage');
    this.schoolId = this.navParams.get('_id');
    this.schoolName = this.navParams.get('name');
    this.storage.get('schoolsDetails').then(data => {
      const schoolData = JSON.parse(data);
      this.schoolEvidences = schoolData[this.schoolId]['assessments'][0]['evidences'];
    }).catch(error => {

    })
  }

  navigateToEvidence(index) : void {
    // this.navCtrl.setRoot('SectionListPage');
    this.navCtrl.push('SectionListPage', {_id:this.schoolId, name: this.schoolName, selectedEvidence: index})
  }

}
