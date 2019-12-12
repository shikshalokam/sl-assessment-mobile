import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Events, Config, AlertController, ActionSheetController, PopoverController } from 'ionic-angular';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { ApiProvider } from '../../providers/api/api';
import { AppConfigs } from '../../providers/appConfig';
import { EvidenceProvider } from '../../providers/evidence/evidence';
import { UtilsProvider } from '../../providers/utils/utils';
import { AssessmentServiceProvider } from '../../providers/assessment-service/assessment-service';
import { ObservationServiceProvider } from '../../providers/observation-service/observation-service';
import { DownloadAndPreviewProvider } from '../../providers/download-and-preview/download-and-preview';
import { TranslateService } from '@ngx-translate/core';
import { ObservationReportsPage } from '../observation-reports/observation-reports';
import { ReportsWithScorePage } from '../reports-with-score/reports-with-score';
import { isRightSide } from 'ionic-angular/umd/util/util';
import { Content } from 'ionic-angular'
import { ScoreReportMenusComponent } from '../../components/score-report-menus/score-report-menus';
/**
 * Generated class for the SubmissionListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-submission-list',
  templateUrl: 'submission-list.html',
})
export class SubmissionListPage {
  height = 100;
  @ViewChild(Content) content: Content;
  showActionsheet: boolean = false;
  showEntityActionsheet: boolean = false;
  activatedSubmission;
  observationDetails: any[];
  programs: any;
  enableCompleteBtn: any;
  selectedObservationIndex: any;
  entityIndex: any;
  observationIndex: any;
  submissionList: any;
  recentlyUpdatedEntity: any;
  assessmentDetails: any;
  currentTab = 'all';
  inProgressObservations = [];
  completedObservations = [];
  submissions;
  // firstLoad = true;
  constructor(
    public navCtrl: NavController,
    private popoverCtrl: PopoverController,
    public navParams: NavParams,
    private apiProvider: ApiProvider,
    private localStorage: LocalStorageProvider,
    private evdnsServ: EvidenceProvider,
    private utils: UtilsProvider,
    private events: Events,
    private alertCntrl: AlertController,
    private dap: DownloadAndPreviewProvider,
    private translate: TranslateService,
    private observationService: ObservationServiceProvider,
    private assessmentService: AssessmentServiceProvider,
    public actionSheetCtrl: ActionSheetController
  ) {
    this.events.subscribe('updateSubmissionStatus', refresh => {
      // this.utils.startLoader();
      this.observationService.refreshObservationList(this.programs).then(success => {
        this.programs = success;
        this.observationDetails[0] = success[this.selectedObservationIndex];
        this.submissionList = this.programs[this.selectedObservationIndex].entities[this.entityIndex].submissions;
        this.goToEcm(this.submissionList.length)
        // this.utils.stopLoader();

      }).catch(error => {
        // this.utils.stopLoader();
      })
    })
  }

  ionViewDidLoad() {
    // this.selectedObservationIndex = this.navParams.get('selectedObservationIndex');
    // this.entityIndex = this.navParams.get('entityIndex');
    // this.observationIndex = this.navParams.get('observationIndex');
    // this.getLocalStorageData();
    // this.firstLoad = false;
  }

  splitCompletedAndInprogressObservations() {
    for (const submission of this.submissionList) {
      (submission.status === 'completed') ? this.completedObservations.push(submission) : this.inProgressObservations.push(submission)
    }
  }

  ionViewDidEnter() {
    this.height = 100;
    // if(this.firstLoad === false)
    // this.observationService.refreshObservationList(this.programs).then(success=>{
    //   tionViewDidEnterhis.programs = success ;
    //   this.submissionList = this.programs[this.selectedObservationIndex].entities[this.entityIndex].submissions;
    // }).catch();
    this.selectedObservationIndex = this.navParams.get('selectedObservationIndex');
    this.recentlyUpdatedEntity = this.navParams.get('recentlyUpdatedEntity');
    this.entityIndex = this.navParams.get('entityIndex');
    this.observationIndex = this.navParams.get('observationIndex');
    this.getLocalStorageData();
    // this.firstLoad = false;
  }

  clearAllObservations() {
    this.submissions = [];
    this.inProgressObservations = [];
    this.completedObservations = [];
  }
  ngAfterViewInit() {
    this.content.ionScroll.subscribe((event) => {
      if (event.directionY == "down" && this.height < event.contentHeight) {
        this.height = this.height + 30;
      } else if (event.directionY == "up" && this.height > 100) {
        this.height = this.height - 30;
      }
    });
  }
  getLocalStorageData() {
    this.observationDetails = [];
    this.utils.startLoader();
    this.clearAllObservations();
    this.localStorage.getLocalStorage('createdObservationList').then(data => {
      this.programs = data;
      this.observationDetails.push(data[this.selectedObservationIndex]);

      this.submissionList = this.observationDetails[0].entities[this.entityIndex].submissions;
      this.splitCompletedAndInprogressObservations();
      this.tabChange(this.currentTab ? this.currentTab : 'all');
      this.utils.stopLoader();

    }).catch(error => {
      this.utils.stopLoader();

    })
  }
  getAssessmentDetails(index, submissionNum = null) {
    let submissionNumber = submissionNum ? submissionNum : this.submissionList[index].submissionNumber
    if (this.activatedSubmission) {
      this.activatedSubmission.showActionsheet = false;
    }
    this.showActionsheet = false;
    this.showEntityActionsheet = false;
    // this.apiProvider.httpGet(AppConfigs.cro.observationDetails + this.programs[this.selectedObservationIndex]._id + "?entityId=" + this.programs[this.selectedObservationIndex].entities[this.entityIndex]._id + "&submissionNumber=" + submissionNumber, success => {
    //   this.assessmentDetails = success;
    //  if( submissionNum ){ 
    //    this.programs[this.selectedObservationIndex]['entities'][this.entityIndex].submissions.push({"submissionId" : success.result.assessment.submissionId}) 
    //  }else {
    //       this.programs[this.selectedObservationIndex]['entities'][this.entityIndex].submissions[index].submissionId = success.result.assessment.submissionId;
    //  }
    //   console.log(this.programs[this.selectedObservationIndex]['entities'][this.entityIndex].submissions[index].submissionId)
    //   this.localStorage.setLocalStorage(this.utils.getAssessmentLocalStorageKey(this.programs[this.selectedObservationIndex]['entities'][this.entityIndex].submissions[index].submissionId), success.result)
    //   submissionNum ? null : this.programs[this.selectedObservationIndex]['entities'][this.entityIndex].submissions[index].downloaded = true;
    //   this.localStorage.setLocalStorage('createdObservationList', this.programs);
    //   submissionNum ? null : this.submissionList[index].downloaded = true;
    //   // this.events.publish('refreshObservationList');
    //   this.goToEcm(index);
    // }, error => {

    // });
    let event = {
      entityIndex: this.navParams.get('entityIndex'),
      observationIndex: this.navParams.get('selectedObservationIndex'),
      submissionIndex: index
    }
    this.assessmentService.getAssessmentDetailsOfCreatedObservation(event, this.programs, 'createdObservationList').then(success => {
      this.programs = success;
      this.observationDetails[0] = success[this.selectedObservationIndex]
      this.submissionList = this.programs[this.selectedObservationIndex].entities[this.entityIndex].submissions;
      this.goToEcm(index)
    }).catch(error => {
    })
  }
  goToEcm(index) {
    let submissionId = this.programs[this.selectedObservationIndex]['entities'][this.entityIndex].submissions[index]._id
    let heading = this.programs[this.selectedObservationIndex]['entities'][this.entityIndex].name;
    this.recentlyUpdatedEntity['submissionId'] = submissionId;
    this.localStorage.getLocalStorage(this.utils.getAssessmentLocalStorageKey(submissionId)).then(successData => {
      if (successData.assessment.evidences.length > 1) {
        this.navCtrl.push('EvidenceListPage', { _id: submissionId, name: heading, recentlyUpdatedEntity: this.recentlyUpdatedEntity })
      } else {
        if (successData.assessment.evidences[0].startTime) {
          this.utils.setCurrentimageFolderName(successData.assessment.evidences[0].externalId, submissionId)
          this.navCtrl.push('SectionListPage', { _id: submissionId, name: heading, selectedEvidence: 0, recentlyUpdatedEntity: this.recentlyUpdatedEntity })
        } else {
          const assessment = { _id: submissionId, name: heading }
          this.openAction(assessment, successData, 0);
        }
      }
    }).catch(error => {
    });
  }

  openAction(assessment, aseessmemtData, evidenceIndex) {
    // console.log(JSON.stringify(assessment))

    this.utils.setCurrentimageFolderName(aseessmemtData.assessment.evidences[evidenceIndex].externalId, assessment._id)
    const options = { _id: assessment._id, name: assessment.name, selectedEvidence: evidenceIndex, entityDetails: aseessmemtData, recentlyUpdatedEntity: this.recentlyUpdatedEntity };
    this.evdnsServ.openActionSheet(options, "Observation");

  }
  observeAgain() {
    // this.getAssessmentDetails(this.submissionList.length , this.submissionList.length + 1)
    let submissionNumber = this.submissionList[this.submissionList.length - 1].submissionNumber + 1;
    let event = {
      entityIndex: this.navParams.get('entityIndex'),
      observationIndex: this.navParams.get('selectedObservationIndex'),
      submissionNumber: submissionNumber
    }
    // this.utils.startLoader();
    this.assessmentService.getAssessmentDetailsOfCreatedObservation(event, this.programs, 'createdObservationList').then(result => {
      this.observationService.refreshObservationList(this.programs).then(success => {
        this.programs = success;
        this.observationDetails[0] = success[this.selectedObservationIndex];
        this.submissionList = this.programs[this.selectedObservationIndex].entities[this.entityIndex].submissions;
        this.getLocalStorageData();
        this.goToEcm(this.submissionList.length)
      }).catch(error => {
      })
    }).catch(error => {
    })
  }
  viewEntityReports() {
    this.showEntityActionsheet = false;
    this.showActionsheet = false;
    const payload = {
      entityId: this.submissionList[0].entityId,
      observationId: this.submissionList[0].observationId
    }
    this.navCtrl.push(ObservationReportsPage, payload);
  }
  viewEntityReportsWithScore() {
    this.showEntityActionsheet = false;
    this.showActionsheet = false;
    const payload = {
      entityId: this.submissionList[0].entityId,
      observationId: this.submissionList[0].observationId
    }
    this.navCtrl.push(ReportsWithScorePage, payload);
  }
  actions(submissionId, action, submission) {
    // this.dap.checkForSubmissionDoc(submissionId, action);
    submission.showActionsheet = false;
    this.showActionsheet = false;
    this.navCtrl.push(ObservationReportsPage, { submissionId: submissionId })
  }
  actionsWithScore(submissionId, action, submission) {
    // this.dap.checkForSubmissionDoc(submissionId, action);
    submission.showActionsheet = false;
    this.showActionsheet = false;
    this.navCtrl.push(ReportsWithScorePage, { submissionId: submissionId })
  }
  deleteSubmission(submissionId) {
    let translateObject;
    this.translate.get(['actionSheet.confirm', 'actionSheet.deleteSubmission', 'actionSheet.no', 'actionSheet.yes']).subscribe(translations => {
      translateObject = translations;
    })
    let alert = this.alertCntrl.create({
      title: translateObject['actionSheet.confirm'],
      message: translateObject['actionSheet.deleteSubmission'],
      buttons: [
        {
          text: translateObject['actionSheet.no'],
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: translateObject['actionSheet.yes'],
          handler: () => {
            this.utils.startLoader();
            this.apiProvider.httpGet(AppConfigs.cro.obsrvationSubmissionDelete + submissionId, success => {
              this.observationService.refreshObservationList(this.programs).then(success => {
                this.programs = success;
                this.submissionList = this.programs[this.selectedObservationIndex].entities[this.entityIndex].submissions;
                this.utils.stopLoader();
                this.getLocalStorageData();
                this.programs[this.selectedObservationIndex].entities[this.entityIndex].submissions.length > 0 ? null : this.navCtrl.pop();

                // this.goToEcm(this.submissionList.length)
              }).catch(error => {
                this.utils.stopLoader();
              });
            }, error => {
              this.utils.stopLoader();
            })
          }
        }
      ]
    });
    alert.present();
  }
  tabChange(value) {
    this.height = 100;
    this.submissions = [];
    this.currentTab = value;
    switch (value) {
      case 'inProgress':
        this.submissions = this.inProgressObservations;

        break
      case 'completed':
        this.submissions = this.completedObservations;
        break
      case 'all':
        this.submissions = this.submissions.concat(this.inProgressObservations, this.completedObservations)
        break
      default:
        this.submissions = this.submissions.concat(this.inProgressObservations, this.completedObservations)
    }
  }
  openActions(submission) {
    if (submission.ratingCompletedAt) {
      this.submissions.forEach(submission => {
        submission.showActionsheet = false;
      });
      this.activatedSubmission = submission;
      submission.showActionsheet = true;
      this.showActionsheet = true;
      this.showEntityActionsheet = false;
    } else {
      this.actions(submission._id, 'preview', submission)
    }
  }
  // Close overlay and action items
  closeAction() {
    if (this.activatedSubmission) {
      this.activatedSubmission.showActionsheet = false;
    }
    this.showActionsheet = false;
    this.showEntityActionsheet = false;
  }

  // Menu for Submissions
  openMenu(event,submission, index) {
    console.log(submission,"submission 339");
    let popover = this.popoverCtrl.create(ScoreReportMenusComponent, {
      submission: submission,
      showEntityActionsheet:"false",
      showSubmissionAction:'true'
    })
    popover.present(
      { ev: event }
    );

  }
  // Menu for Entity reports
  openEntityReportMenu(event) {
    let popover = this.popoverCtrl.create(ScoreReportMenusComponent, {
      observationId: this.submissionList[0].observationId,
      entityId:this.submissionList[0].entityId,
      showEntityActionsheet:"true",
      showSubmissionAction:'false'
    })
    popover.present(
      { ev: event }
    );

  }
  //  entity actions
  entityActions() {
    let noScore: boolean = true;
    this.submissions.forEach(submission => {
      submission.showActionsheet = false;
      if (submission.ratingCompletedAt) {
        this.showActionsheet = true;
        this.showEntityActionsheet = true;
        noScore = false;
      }
    });
    if (noScore) {
      this.viewEntityReports();
    }
  }
}