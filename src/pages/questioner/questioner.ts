import { Component, ViewChild, ComponentFactory, ComponentFactoryResolver, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UtilsProvider } from '../../providers/utils/utils';
import { SectionListPage } from '../section-list/section-list';

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

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storage: Storage, private appCtrl: App, private cfr: ComponentFactoryResolver,
    private utils: UtilsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SectionListPage');
    this.schoolId = this.navParams.get('_id');
    this.schoolName = this.navParams.get('name');
    this.selectedEvidenceIndex = this.navParams.get('selectedEvidence');
    this.selectedSectionIndex = this.navParams.get('selectedSection');
    this
    this.storage.get('schoolsDetails').then(data => {
      this.schoolData = JSON.parse(data);
      this.questions = this.schoolData[this.schoolId]['assessments'][0]['evidences'][this.selectedEvidenceIndex]['sections'][this.selectedSectionIndex]['questions'];
      this.selectedEvidenceId = this.schoolData[this.schoolId]['assessments'][0]['evidences'][this.selectedEvidenceIndex]._id;
      this.isCurrentEvidenceSubmitted = this.schoolData[this.schoolId]['assessments'][0]['evidences'][this.selectedEvidenceIndex].isSubmitted
      console.log(JSON.stringify(this.questions))
    }).catch(error => {

    })
  }

  next(status?: string) {
    console.log(status)
    // console.log(JSON.stringify(this.schoolData))
    console.log(this.start);
    if (this.questions[this.start].children.length) {
      this.updateTheChildrenQuestions(this.questions[this.start])
    }
    if (this.end < this.questions.length && !status) {
      this.utils.setLocalSchoolData(this.schoolData)
      this.start++;
      this.end++;
      console.log("check for question")
      if (this.questions[this.start].visibleIf && !this.checkForQuestionDisplay(this.questions[this.start])) {
        this.questions[this.start].isCompleted = true;
        this.next();
      } else if(this.questions[this.start].visibleIf && this.checkForQuestionDisplay(this.questions[this.start])) {
        // if()
      }
    } else if (status === 'completed') {
      this.utils.setLocalSchoolData(this.schoolData);
      // this.navCtrl.popToRoot()
      const opt = {
        _id: this.schoolId,
        name: this.schoolName,
        selectedEvidence: this.selectedEvidenceIndex
      }
      this.navCtrl.pop()
    } else {
      // console.log('hiiii')
      this.next('completed')
    }
  }

  checkForQuestionDisplay(qst): boolean {
    console.log('checkcondition')

    let display = false;
    for (const question of this.questions) {
      console.log('"' + question.value + '"' + qst.visibleIf[0].operator + '"' + qst.visibleIf[0].value + '"');
      if ((question._id === qst.visibleIf[0]._id) && (eval('"' + question.value + '"' + qst.visibleIf[0].operator + '"' + qst.visibleIf[0].value + '"'))) {
        display = true;
        // if (qst.validation.minNoOfInstance === 'value') {
        //   qst.validation.minNoOfInstance = question.value;
        // }
      }
    }
    return display
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
      this.utils.setLocalSchoolData(this.schoolData)
      this.start--;
      this.end--;
      if (this.questions[this.start].visibleIf && !this.checkForQuestionDisplay(this.questions[this.start])) {
        this.back();
      }
    }
  }

  feedBack() {
    this.utils.sendFeedback()
  }
}
