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
  isLast: boolean

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
    this.storage.get('schoolsDetails').then(data => {
      this.schoolData = JSON.parse(data);
      this.questions = this.schoolData[this.schoolId]['assessments'][0]['evidences'][this.selectedEvidenceIndex]['sections'][this.selectedSectionIndex]['questions'];
      console.log(JSON.stringify(this.questions))
    }).catch(error => {

    })
  }

  next(status?:string) {
    console.log(status)
    // console.log(JSON.stringify(this.schoolData))
    if (this.end < this.questions.length && !status) {
      this.utils.setLocalSchoolData(this.schoolData)
      this.start++;
      this.end++;
    } else if (status === 'completed') {
      this.utils.setLocalSchoolData(this.schoolData)
      this.navCtrl.push(SectionListPage, {_id:this.schoolId, name: this.schoolName, selectedEvidence: this.selectedEvidenceIndex})
    }
  }

  back() {
    if (this.start > 0) {
      this.utils.setLocalSchoolData(this.schoolData)
      this.start--;
      this.end--;
    }
  }
}
