import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UtilsProvider } from '../../providers/utils/utils';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { EvidenceProvider } from '../../providers/evidence/evidence';

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
  schoolData: any;
  currentEvidenceStatus: string;
  isIos: boolean = this.platform.is('ios');
  generalQuestions: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storage: Storage, private appCtrl: App, private utils: UtilsProvider,
    private feedback: FeedbackProvider, private evdnsServ: EvidenceProvider, private platform: Platform) {
  }

  ionViewWillEnter() {
    console.log('ionViewDidLoad EvidenceListPage');
    this.schoolId = this.navParams.get('_id');
    this.schoolName = this.navParams.get('name');
    this.storage.get('generalQuestions').then(data => {
      this.generalQuestions = JSON.parse(data)[this.schoolId];
    }).catch(error => {

    })
    this.utils.startLoader();
    this.storage.get('schoolsDetails').then(data => {
      this.utils.stopLoader()
      this.schoolData = JSON.parse(data);
      this.schoolEvidences = this.schoolData[this.schoolId]['assessments'][0]['evidences'];
      this.checkForProgressStatus();
    }).catch(error => {
      this.utils.stopLoader()
    })
  }

  goToGeneralQuestionList() : void {
    this.appCtrl.getRootNav().push('GeneralQuestionListPage', { _id: this.schoolId, name: this.schoolName})

  }

  checkForProgressStatus() {
    for (const evidence of this.schoolEvidences) {
      // console.log(evidence.startTime);
      if (evidence.isSubmitted) {
        evidence.progressStatus = 'submitted';
      } else if (!evidence.startTime) {
        evidence.progressStatus = '';
      } else {
        evidence.progressStatus = 'completed';
        for (const section of evidence.sections) {
          if (section.progressStatus === 'inProgress' || !section.progressStatus) {
            evidence.progressStatus = 'inProgress';
          }
        }
      }
    }
  }

  openAction(school, evidenceIndex) {
    this.utils.setCurrentimageFolderName(this.schoolEvidences[evidenceIndex].externalId.externalId, school._id)
    const options = { _id: school._id, name: school.name, selectedEvidence: evidenceIndex, schoolDetails: this.schoolData };
    this.evdnsServ.openActionSheet(options);
  }

  navigateToEvidence(index): void {
    if (this.schoolEvidences[index].startTime) {
      this.utils.setCurrentimageFolderName(this.schoolEvidences[index].externalId, this.schoolId)
      this.navCtrl.push('SectionListPage', { _id: this.schoolId, name: this.schoolName, selectedEvidence: index })
    } else {
      const school = {_id: this.schoolId, name: this.schoolName}
      this.openAction(school, index);
    }
    // this.navCtrl.setRoot('SectionListPage');
    // this.appCtrl.getRootNav().push('SectionListPage', {_id:this.schoolId, name: this.schoolName, selectedEvidence: index});
    // if (!this.schoolEvidences[index].startTime) {
    //   this.schoolEvidences[index].startTime = Date.now();
    //   this.utils.setLocalSchoolData(this.schoolData)
    // }
    // this.utils.setCurrentimageFolderName(this.schoolEvidences[index].externalId, this.schoolId)
    // this.navCtrl.push('SectionListPage', { _id: this.schoolId, name: this.schoolName, selectedEvidence: index })
  }

  ionViewWillLeave(){
    if(this.navParams.get('parent')){
      this.navParams.get('parent').onInit();
    }
  }

  feedBack() {
    this.feedback.sendFeedback()
  }
  

}
