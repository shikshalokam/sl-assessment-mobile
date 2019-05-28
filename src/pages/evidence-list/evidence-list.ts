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

  entityId: any;
  entityName: string;
  entityEvidences: any;
  entityData: any;
  currentEvidenceStatus: string;
  isIos: boolean = this.platform.is('ios');
  generalQuestions: any;
  submissionId: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private appCtrl: App, private utils: UtilsProvider, private localStorage: LocalStorageProvider,
    private feedback: FeedbackProvider, private evdnsServ: EvidenceProvider, private platform: Platform) {
    this.entityId = this.navParams.get('_id');
    this.entityName = this.navParams.get('name');
    this.submissionId = this.navParams.get('submissionId');
  }
 
  ionViewWillEnter() {
    //console.log('ionViewDidLoad EvidenceListPage');
    this.utils.startLoader();
    this.localStorage.getLocalStorage(this.utils.getAssessmentLocalStorageKey(this.entityId)).then(successData => {
      this.utils.stopLoader();
      this.entityData = successData;
      //console.log(JSON.stringify(successData));
      this.entityEvidences = this.entityData['assessment']['evidences'] ;
      this.checkForProgressStatus();
      this.localStorage.getLocalStorage('generalQuestions_' + this.entityId).then(successData => {
        this.generalQuestions = successData;
      }).catch(error => {
      });
    }).catch(error => {
      this.utils.stopLoader()
    })
  }

  goToGeneralQuestionList(): void {
    this.appCtrl.getRootNav().push('GeneralQuestionListPage', { _id: this.entityId, name: this.entityName })
  }

  checkForProgressStatus() {
    for (const evidence of this.entityEvidences) {
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
    this.utils.setCurrentimageFolderName(this.entityEvidences[evidenceIndex].externalId, assessment._id)
    const options = { _id: assessment._id, name: assessment.name, selectedEvidence: evidenceIndex, entityDetails: this.entityData };
    //console.log("testing 1")
    this.evdnsServ.openActionSheet(options);
    //console.log("testing 2")

  }

  navigateToEvidence(index): void {
    //console.log(JSON.stringify(this.entityId))
    if (this.entityEvidences[index].startTime) {
      //console.log("if loop")
      this.utils.setCurrentimageFolderName(this.entityEvidences[index].externalId, this.entityId)
      this.navCtrl.push('SectionListPage', { _id: this.entityId, name: this.entityName, selectedEvidence: index })
    } else {
      //console.log("else loop")

      const entity = { _id: this.entityId, name: this.entityName }
      this.openAction(entity, index);
    }
  }

  ionViewWillLeave() {
  }

  feedBack() {
    this.feedback.sendFeedback()
  }


}
