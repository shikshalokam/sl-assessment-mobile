import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { AppConfigs } from '../../providers/appConfig';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { MenuItemComponent } from '../../components/menu-item/menu-item';
import { AssessmentServiceProvider } from '../../providers/assessment-service/assessment-service';
import { UtilsProvider } from '../../providers/utils/utils';

/**
 * Generated class for the ObservationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-observations',
  templateUrl: 'observations.html',
})
export class ObservationsPage {

  programs: any;
  enableRefresh = AppConfigs.configuration.enableAssessmentListRefresh;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private localStorage: LocalStorageProvider,
    private popoverCtrl: PopoverController,
    private assessmentService:AssessmentServiceProvider,
    private utils : UtilsProvider
    ) {
  }

  ionViewDidLoad() {
    //console.log("observation page called");
    this.localStorage.getLocalStorage('observationList').then(data => { 
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
    this.assessmentService.getAssessmentsApi ('observation').then(programs =>{
      this.programs = programs;
      //console.log("success in observations list api function");

    }).catch(error=>{
      //console.log("error in observations list api function");
    })
    

  }

  refresh(event?: any) {
   event ? this.assessmentService.refresh(this.programs ,'observation', event).then( program =>{
     this.programs = program;
     //console.log(program);
   }).catch( error=>{})
   : 
   this.assessmentService.refresh(this.programs,'observation').then(program =>{
    this.programs = program;
   }
   ).catch( error =>{

   });
  }


  getAssessmentDetails(event) {
    this.assessmentService.getAssessmentDetails(event,this.programs ,'observation').then(program=>{
    this.programs = program;
    }).catch(error=>{

    })
  }
  // openAction(assessment, aseessmemtData, evidenceIndex) {
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
  //   //console.log(JSON.stringify(event) )

  //   this.localStorage.getLocalStorage(this.utils.getAssessmentLocalStorageKey(submissionId)).then(successData => {
      
  //     //console.log(JSON.stringify(successData));
  //   //console.log("go to ecm called");


  //     if (successData.assessment.evidences.length > 1) {

  //       this.navCtrl.push('EvidenceListPage', { _id: submissionId, name: heading })

  //     } else {
  //       if (successData.assessment.evidences[0].startTime) {
  //         this.utils.setCurrentimageFolderName(successData.assessment.evidences[0].externalId, submissionId)
  //         this.navCtrl.push('SectionListPage', { _id: submissionId, name: heading, selectedEvidence: 0 })
  //       } else {
  //         const assessment = { _id: submissionId, name: heading }
  //         this.openAction(assessment, successData, 0);
  //       }
  //     }
  //   }).catch(error => {
  //   })
  // }
  openMenu(event) {
    this.assessmentService.openMenu(event,this.programs , false);
    // var myEvent = event.event;
    // var  programIndex =  event.programIndex;
    // var assessmentIndex = event.assessmentIndex ;
    // var schoolIndex = event.entityIndex;
    // var submissionId = event.submissionId;
    // let showMenuArray;
    
    // this.localStorage.getLocalStorage(this.utils.getAssessmentLocalStorageKey(submissionId)).then(successData => { 
    //   showMenuArray= successData.solution.registry ;
    //   //console.log(JSON.stringify(successData.solution.registry ));
    //   let popover = this.popoverCtrl.create(MenuItemComponent, {
    //     submissionId:this.programs[programIndex].solutions[assessmentIndex].entities[schoolIndex].submissionId ,
    //     _id:this.programs[programIndex].solutions[assessmentIndex].entities[schoolIndex]['_id'],
    //     name: this.programs[programIndex].solutions[assessmentIndex].entities[schoolIndex]['name'],
    //     programId: this.programs[programIndex]._id,
    //     // hideTeacherRegistry : false,
    //     // hideLeaderRegistry:false,
    //     // hideFeedback:false
    //     showMenuArray : showMenuArray
    //   });
    //   popover.present({
    //     ev: myEvent
    //   });
    // }).catch( error =>{

    // })

    // //console.log(JSON.stringify(this.programs));
    // //console.log(programIndex + " "+ assessmentIndex+" "+schoolIndex)
    // //console.log(JSON.stringify(this.programs[programIndex].assessments[assessmentIndex].schools[schoolIndex]['_id']));
    // //console.log(this.programs[programIndex].assessments[assessmentIndex].schools[schoolIndex]['name']);
    // //console.log(this.programs[programIndex]._id);
  
   
  }
}
