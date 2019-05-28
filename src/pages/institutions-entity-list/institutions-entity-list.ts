import { Component } from '@angular/core';
import { NavController, NavParams, App, PopoverController } from 'ionic-angular';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { MenuItemComponent } from '../../components/menu-item/menu-item';
import { AppConfigs } from '../../providers/appConfig';
import { AssessmentServiceProvider } from '../../providers/assessment-service/assessment-service';

@Component({
  selector: 'institutions-entity-list',
  templateUrl: 'institutions-entity-list.html',
})
export class InstitutionsEntityList {


  programs: any;
  enableRefresh = AppConfigs.configuration.enableAssessmentListRefresh;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private popoverCtrl: PopoverController,
    private localStorage: LocalStorageProvider,
    private assessmentService: AssessmentServiceProvider,
  ) {
  }

  ionViewDidLoad() {
    this.localStorage.getLocalStorage('institutionalList').then(data => {
      if (data) {
        this.programs = data;
      } else {
        this.getAssessmentsApi();
      }
    }).catch(error => {
      this.getAssessmentsApi();
    })
  }

  ionViewWillEnter() {
  }



  getAssessmentsApi() {
    this.assessmentService.getAssessmentsApi('institutional').then(programs => {
      this.programs = programs;
      console.log("success in institutional list api function");

    }).catch(error => {
      console.log("error in institutional list api function");
    })


  }

  refresh(event?: any) {
    event ? this.assessmentService.refresh(this.programs, 'institutional', event).then(program => {
      this.programs = program;
    }).catch(error => { })
      :
      this.assessmentService.refresh(this.programs, 'institutional').then(program => {
        this.programs = program;
      }
      ).catch(error => {

      });
  }


  getAssessmentDetails(event) {
    this.assessmentService.getAssessmentDetails(event, this.programs, 'institutional').then(program => {
      this.programs = program;
    }).catch(error => {

    })
  }

  // openAction(assessment, aseessmemtData, evidenceIndex) {
  // //   console.log("open action");

  // //   console.log(aseessmemtData.assessment.evidences[evidenceIndex].externalId);
  // //   console.log(JSON.stringify(aseessmemtData.solutions[0].evidences[evidenceIndex].externalId))
  // // console.log(JSON.stringify(aseessmemtData));

  //   this.utils.setCurrentimageFolderName(aseessmemtData.assessment.evidences[evidenceIndex].externalId, assessment._id)
  //   const options = { _id: assessment._id, name: assessment.name, selectedEvidence: evidenceIndex, schoolDetails: aseessmemtData };
  //   this.evdnsServ.openActionSheet(options);
  // }

  // goToParentDetails() {
  //   this.navCtrl.push(ProgramDetailsPage)
  // }


  // goToEcm(event) {

  //   let submissionId = event.submissionId;
  //   let heading = event.name;
  //   console.log(JSON.stringify(event) )

  //   this.localStorage.getLocalStorage(this.utils.getAssessmentLocalStorageKey(submissionId)).then(successData => {

  //     console.log(JSON.stringify(successData));
  //   console.log("go to ecm called");


  //     if (successData.assessment.evidences.length > 1) {

  //       this.navCtrl.push('EvidenceListPage', { _id: submissionId, name: heading })

  //     } else {
  //       if (successData.assessment.evidences[0].startTime) {
  //         this.utils.setCurrentimageFolderName(successData.assessment.evidences[0].externalId, submissionId)
  //         this.navCtrl.push('SectionListPage', { _id: submissionId, name: heading, selectedEvidence: 0 })
  //       } else {
  //         const assessment = { _id: submissionId, name: heading }
  //         console.log(successData)
  //         this.openAction(assessment, successData, 0);
  //       }
  //     }
  //   }).catch(error => {
  //   })
  // }
  openMenu(event) {

    var myEvent = event.event;
    var programIndex = event.programIndex;
    var assessmentIndex = event.assessmentIndex;
    var schoolIndex = event.entityIndex;
    console.log(JSON.stringify(this.programs) + "programs");
    // console.log(programIndex + " "+ assessmentIndex+" "+schoolIndex)
    // console.log(JSON.stringify(this.programs[programIndex].assessments[assessmentIndex].schools[schoolIndex]['_id']));
    // console.log(this.programs[programIndex].assessments[assessmentIndex].schools[schoolIndex]['name']);
    // console.log(this.programs[programIndex]._id);

    let popover = this.popoverCtrl.create(MenuItemComponent, {
      submissionId: this.programs[programIndex].solutions[assessmentIndex].entities[schoolIndex].submissionId,
      _id: this.programs[programIndex].solutions[assessmentIndex].entities[schoolIndex]['_id'],
      name: this.programs[programIndex].solutions[assessmentIndex].entities[schoolIndex]['name'],
      programId: this.programs[programIndex]._id,

    });
    popover.present({
      ev: myEvent
    });
  }
}
