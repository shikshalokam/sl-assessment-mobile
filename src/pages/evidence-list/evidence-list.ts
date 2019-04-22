import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UtilsProvider } from '../../providers/utils/utils';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { EvidenceProvider } from '../../providers/evidence/evidence';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';

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
    private appCtrl: App, private utils: UtilsProvider, private localStorage: LocalStorageProvider,
    private feedback: FeedbackProvider, private evdnsServ: EvidenceProvider, private platform: Platform) {
    this.schoolId = this.navParams.get('_id');
    this.schoolName = this.navParams.get('name');
  }

  ionViewWillEnter() {
    console.log('ionViewDidLoad EvidenceListPage');
    this.utils.startLoader();
    this.localStorage.getLocalStorage(this.utils.getAssessmentLocalStorageKey(this.schoolId)).then(successData => {
      this.schoolData = successData;
      this.schoolEvidences = this.schoolData['assessments'][0] ? this.schoolData['assessments'][0]['evidences'] : this.schoolData['assessments']['evidences'];
      this.utils.stopLoader();
      this.checkForProgressStatus();
      this.localStorage.getLocalStorage('generalQuestions_' + this.schoolId).then(successData => {
        this.generalQuestions = successData;
      }).then(error => {
      })
    }).catch(error => {
      this.utils.stopLoader()
    })
  }

  goToGeneralQuestionList(): void {
    this.appCtrl.getRootNav().push('GeneralQuestionListPage', { _id: this.schoolId, name: this.schoolName })
  }

  checkForProgressStatus() {
    for (const evidence of this.schoolEvidences) {
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

  openAction(assessment, evidenceIndex) {
    this.utils.setCurrentimageFolderName(this.schoolEvidences[evidenceIndex].externalId, assessment._id)
    const options = { _id: assessment._id, name: assessment.name, selectedEvidence: evidenceIndex, schoolDetails: this.schoolData };
    this.evdnsServ.openActionSheet(options);
  }

  navigateToEvidence(index): void {
    if (this.schoolEvidences[index].startTime) {
      this.utils.setCurrentimageFolderName(this.schoolEvidences[index].externalId, this.schoolId)
      this.navCtrl.push('SectionListPage', { _id: this.schoolId, name: this.schoolName, selectedEvidence: index })
    } else {
      const school = { _id: this.schoolId, name: this.schoolName }
      this.openAction(school, index);
    }
  }

  ionViewWillLeave() {
  }

  feedBack() {
    this.feedback.sendFeedback()
  }


}
