import { Component } from '@angular/core';
import { NavController, NavParams, App, PopoverController } from 'ionic-angular';
import { AppConfigs } from '../../providers/appConfig';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { MenuItemComponent } from '../../components/menu-item/menu-item';
import { AssessmentServiceProvider } from '../../providers/assessment-service/assessment-service';

// @IonicPage()
@Component({
  selector: 'page-individual-listing',
  templateUrl: 'individual-listing.html',
})
export class IndividualListingPage {

  programs: any;
  enableRefresh = AppConfigs.configuration.enableAssessmentListRefresh;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private popoverCtrl: PopoverController,
    private localStorage: LocalStorageProvider,
    private assessmentService :AssessmentServiceProvider,
    ) {
  }

  ionViewDidLoad() {
    this.localStorage.getLocalStorage('individualList').then(data => {
      if (data) {
        this.programs = data;
      } else {
        this.getAssessmentsApi();
      }
    }).catch(error => {
      this.getAssessmentsApi();
    })
  }

 
  getAssessmentsApi() {
    this.assessmentService.getAssessmentsApi ('individual').then(programs =>{
      this.programs = programs;
      console.log("success in individual list api function");

    }).catch(error=>{
      console.log("error in individual list api function");
    })
    

  }

  refresh(event?: any) {
   event ? this.assessmentService.refresh(this.programs ,'individual', event).then( program =>{
     this.programs = program;
   }).catch( error=>{})
   : 
   this.assessmentService.refresh(this.programs,'individual').then(program =>{
    this.programs = program;
   }
   ).catch( error =>{

   });
  }


  getAssessmentDetails(event) {
    this.assessmentService.getAssessmentDetails(event,this.programs ,'individual').then(program=>{
    this.programs = program;
    }).catch(error=>{

    })
  }


  // openAction(assessment, aseessmemtData, evidenceIndex) {
  //   console.log(JSON.stringify(aseessmemtData));
  //   // console.log("open action");

  //   // console.log(aseessmemtData.solutions[0].evidences[evidenceIndex].externalId);
  //   // console.log(JSON.stringify(aseessmemtData.solutions[0].evidences[evidenceIndex].externalId))
  //   // console.log(JSON.stringify(aseessmemtData))
  //   this.utils.setCurrentimageFolderName(aseessmemtData.assessment.evidences[evidenceIndex].externalId, assessment._id)
  //   // console.log("open action");

  //   const options = { _id: assessment._id, name: assessment.name, selectedEvidence: evidenceIndex, schoolDetails: aseessmemtData };
  //   // console.log(JSON.stringify(options))
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
  //         console.log("if loop " + successData.assessment.evidences[0].externalId)
  //         this.utils.setCurrentimageFolderName(successData.assessment.evidences[0].externalId, submissionId)
  //         this.navCtrl.push('SectionListPage', { _id: submissionId, name: heading, selectedEvidence: 0 })
  //       } else {

  //         const assessment = { _id: submissionId, name: heading }
  //         this.openAction(assessment, successData, 0);
  //         console.log("else loop");

  //       }
  //     }
  //   }).catch(error => {
  //   })
  // }
  openMenu(event) {

    var myEvent = event.event;
    var  programIndex =  event.programIndex;
    var assessmentIndex = event.assessmentIndex ;
    var schoolIndex = event.entityIndex;
    console.log(JSON.stringify(this.programs));
    // console.log(programIndex + " "+ assessmentIndex+" "+schoolIndex)
    // console.log(JSON.stringify(this.programs[programIndex].assessments[assessmentIndex].schools[schoolIndex]['_id']));
    // console.log(this.programs[programIndex].assessments[assessmentIndex].schools[schoolIndex]['name']);
    // console.log(this.programs[programIndex]._id);
  
    let popover = this.popoverCtrl.create(MenuItemComponent, {
      submissionId: this.programs[programIndex].solutions[assessmentIndex].entities[schoolIndex].submissionId,
      
      _id:this.programs[programIndex].solutions[assessmentIndex].entities[schoolIndex]['_id'],
      name: this.programs[programIndex].solutions[assessmentIndex].entities[schoolIndex]['name'],
      programId: this.programs[programIndex]._id,
      hideTeacherRegistry : false,
      hideLeaderRegistry:false,
      hideFeedback:false
    });
    popover.present({
      ev: myEvent
    });
  }

}
