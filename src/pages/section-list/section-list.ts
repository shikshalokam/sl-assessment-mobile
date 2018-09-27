import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
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

  evidenceSections: any;
  schoolName: string;
  schoolId: any;
  selectedEvidenceIndex: any;
  selectedEvidenceName: string;
  schoolData: any;
  allAnsweredForEvidence: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storage: Storage, private appCtrl: App) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SectionListPage');
    this.schoolId = this.navParams.get('_id');
    this.schoolName = this.navParams.get('name');
    this.selectedEvidenceIndex = this.navParams.get('selectedEvidence');
    this.storage.get('schoolsDetails').then(data => {
      this.schoolData = JSON.parse(data);
      this.evidenceSections = this.schoolData[this.schoolId]['assessments'][0]['evidences'][this.selectedEvidenceIndex]['sections'];
      this.selectedEvidenceName = this.schoolData[this.schoolId]['assessments'][0]['evidences'][this.selectedEvidenceIndex]['name'];
      this.checkForEvidenceCompletion();
      // console.log(JSON.stringify(this.evidenceSections))
    }).catch(error => {

    })
  }

  checkForEvidenceCompletion() : void {
    let allAnswered = true;
    for (const section of this.evidenceSections) {
      for(const question of section.questions) {
        if(!question.isCompleted) {
          allAnswered = false;
          break;
        }
      }
    }
    this.allAnsweredForEvidence = allAnswered;
  }

  goToQuestioner(selectedSection): void {
    const params = {
      _id: this.schoolId,
      name: this.schoolName,
      selectedEvidence: this.selectedEvidenceIndex,
      selectedSection: selectedSection
    };
    this.appCtrl.getRootNav().push('QuestionerPage', params)
  }

}
