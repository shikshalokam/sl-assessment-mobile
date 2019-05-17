import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { UtilsProvider } from '../../providers/utils/utils';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';

@IonicPage()
@Component({
  selector: 'page-questioner',
  templateUrl: 'questioner.html',
})
export class QuestionerPage {
  @ViewChild('sample') nameInputRef: ElementRef;

  questions: any;
  schoolName: string;
  schoolId: any;
  selectedEvidenceIndex: any;
  selectedSectionIndex: any;
  start: number = 0;
  end: number = 1;
  schoolData: any;
  isLast: boolean;
  isFirst: boolean;
  selectedEvidenceId: string;
  isCurrentEvidenceSubmitted: any;
  allQuestionsOfEvidence: Array<any> = [];
  isViewOnly: boolean;
  dashbordData: any;
  modalRefrnc: any;
  localImageListKey: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private localStorage: LocalStorageProvider,
    private utils: UtilsProvider,
    private feedback: FeedbackProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Questioner');
    this.schoolId = this.navParams.get('_id');
    this.schoolName = this.navParams.get('name');
    this.selectedEvidenceIndex = this.navParams.get('selectedEvidence');
    this.selectedSectionIndex = this.navParams.get('selectedSection');
    this.utils.startLoader();
    this.localStorage.getLocalStorage(this.utils.getAssessmentLocalStorageKey(this.schoolId)).then(data => {
      this.schoolData = data;
      const currentEvidences = this.schoolData['assessments'][0] ? this.schoolData['assessments'][0]['evidences'] : this.schoolData['assessments']['evidences']
      this.selectedEvidenceId = currentEvidences[this.selectedEvidenceIndex].externalId;
      this.localImageListKey = "images_" + this.selectedEvidenceId + "_" + this.schoolId;
      this.isViewOnly = !currentEvidences[this.selectedEvidenceIndex]['startTime'] ? true : false;
      this.questions = currentEvidences[this.selectedEvidenceIndex]['sections'][this.selectedSectionIndex]['questions'];
      this.dashbordData = {
        questions: this.questions,
        evidenceMethod: currentEvidences[this.selectedEvidenceIndex]['name'],
        sectionName: currentEvidences[this.selectedEvidenceIndex]['sections'][this.selectedSectionIndex].name,
        currentViewIndex: this.start
      }
      this.isCurrentEvidenceSubmitted = currentEvidences[this.selectedEvidenceIndex].isSubmitted
      this.utils.stopLoader();
    }).catch(error => {
      this.utils.stopLoader();

    })
    // this.storage.get('schoolsDetails').then(data => {
    //   this.schoolData = JSON.parse(data);
    //   this.selectedEvidenceId = this.schoolData[this.schoolId]['assessments'][0]['evidences'][this.selectedEvidenceIndex].externalId;
    //   this.localImageListKey = "images_" + this.selectedEvidenceId + "_" + this.schoolId;
    //   // console.log("sample " +this.schoolData[this.schoolId]['assessments'][0]['evidences'][this.selectedEvidenceIndex]['startTime'])
    //   this.isViewOnly = !this.schoolData[this.schoolId]['assessments'][0]['evidences'][this.selectedEvidenceIndex]['startTime'] ? true : false;
    //   this.questions = this.schoolData[this.schoolId]['assessments'][0]['evidences'][this.selectedEvidenceIndex]['sections'][this.selectedSectionIndex]['questions'];
    //   // console.log(JSON.stringify(this.schoolData[this.schoolId]['assessments'][0]['evidences'][this.selectedEvidenceIndex]['sections'][this.selectedSectionIndex].name))
    //   this.dashbordData = {
    //     questions: this.questions,
    //     evidenceMethod: this.schoolData[this.schoolId]['assessments'][0]['evidences'][this.selectedEvidenceIndex]['name'],
    //     sectionName: this.schoolData[this.schoolId]['assessments'][0]['evidences'][this.selectedEvidenceIndex]['sections'][this.selectedSectionIndex].name,
    //     currentViewIndex: this.start
    //   }
    //   this.isCurrentEvidenceSubmitted = this.schoolData[this.schoolId]['assessments'][0]['evidences'][this.selectedEvidenceIndex].isSubmitted
    //   // console.log(this.allQuestionsOfEvidence.length + " length of questions");
    //   this.utils.stopLoader();

    // }).catch(error => {
    //   this.utils.stopLoader();

    // })
  }
  // images_CO_5bebcfcf92ec921dcf114828

  next(status?: string) {
    if (this.questions[this.start].children.length) {
      this.updateTheChildrenQuestions(this.questions[this.start])
    }
    if (this.end < this.questions.length && !status) {
      this.localStorage.setLocalStorage(this.utils.getAssessmentLocalStorageKey(this.schoolId), this.schoolData)
      this.start++;
      this.end++;;
      this.dashbordData.currentViewIndex = this.start;
      if (this.questions[this.start].visibleIf.length && this.questions[this.start].visibleIf[0] && !this.checkForQuestionDisplay(this.questions[this.start])) {
        this.questions[this.start].isCompleted = true;
        this.next();
      } else if (this.questions[this.start].visibleIf.length && this.questions[this.start].visibleIf[0] && this.checkForQuestionDisplay(this.questions[this.start])) {
      }
    } else if (status === 'completed') {
      this.localStorage.setLocalStorage(this.utils.getAssessmentLocalStorageKey(this.schoolId), this.schoolData)
      this.navCtrl.pop()
    } else {
      this.next('completed')
    }
  }

  updateLocalData(): void {
    this.localStorage.setLocalStorage(this.utils.getAssessmentLocalStorageKey(this.schoolId), this.schoolData)
  }

  checkForQuestionDisplay(qst): boolean {
    return this.utils.checkForDependentVisibility(qst, this.questions)
  }

  updateTheChildrenQuestions(parentQuestion) {
    for (const child of parentQuestion.children) {
      for (const question of this.questions) {
        if (child === question._id && (eval('"' + parentQuestion.value + '"' + question.visibleIf[0].operator + '"' + question.visibleIf[0].value + '"')) && !question.value) {
          question.isCompleted = false;
        } else if (child === question._id && parentQuestion.value !== question.visibleIf[0].value) {
          question.isCompleted = true;
        }
      }
    }
  }

  back() {
    if (this.questions[this.start].children.length) {
      this.updateTheChildrenQuestions(this.questions[this.start])
    }
    if (this.start > 0) {
      this.localStorage.setLocalStorage(this.utils.getAssessmentLocalStorageKey(this.schoolId), this.schoolData)
      this.start--;
      this.dashbordData.currentViewIndex = this.start;
      this.end--;
      if (this.questions[this.start].visibleIf.length && !this.checkForQuestionDisplay(this.questions[this.start])) {
        this.back();
      }
    }
  }

  feedBack() {
    this.feedback.sendFeedback()
  }

  setModalRefernc(refrc): void {
    this.modalRefrnc = refrc;
    this.modalRefrnc.onDidDismiss(data => {
      if (data >= 0) {
        this.start = data;
        this.end = data + 1;
        this.dashbordData.currentViewIndex = data;
      }
    })
  }
}
