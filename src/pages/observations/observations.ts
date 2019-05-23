import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { AppConfigs } from '../../providers/appConfig';
import { ApiProvider } from '../../providers/api/api';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { UpdateLocalSchoolDataProvider } from '../../providers/update-local-school-data/update-local-school-data';
import { EvidenceProvider } from '../../providers/evidence/evidence';
import { UtilsProvider } from '../../providers/utils/utils';
import { ProgramDetailsPage } from '../program-details/program-details';
import { MenuItemComponent } from '../../components/menu-item/menu-item';

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
    private apiService: ApiProvider,
    private localStorage: LocalStorageProvider,
    private ulsd: UpdateLocalSchoolDataProvider,
    private evdnsServ: EvidenceProvider,
    private popoverCtrl: PopoverController,
    private utils: UtilsProvider) {
  }

  ionViewDidLoad() {
    console.log("observation page called");
    this.localStorage.getLocalStorage('observationsList').then(data => { 
      if (data) {
        this.programs = data;
      } else {
        this.getObservationsApi();
      }
    }).catch(error => {
      this.getObservationsApi();
    })
  }

  getObservationsApi() {
    const url = AppConfigs.assessmentsList.listOfAssessment + "observation";
    console.log(url)
    this.utils.startLoader()
    console.log("List api called ")
    this.apiService.httpGet(url, successData => {
      console.log("success data")
      this.utils.stopLoader();
      console.log(JSON.stringify(successData))
      for (const program of successData.result) {
        for (const solution of program.solutions) {
          for (const entity of solution.entities) {
            entity.downloaded = false;
            entity.submissionId= null;
          }
        }
      }
      this.programs = successData.result;
      this.localStorage.setLocalStorage("observationsList", successData.result);
    }, error => {
      console.log("error in list of assessment")
      this.utils.stopLoader()
    })

    console.log("function end")
  }

  refresh(event?: any) {
    const url = AppConfigs.assessmentsList.listOfAssessment + "observation" ;
    // const url = AppConfigs.survey.fetchIndividualAssessments + "?type=assessment&subType=individual&status=active";
    event ? "" : this.utils.startLoader();
    this.apiService.httpGet(url, successData => {
      const downloadedAssessments = []
      const currentPrograms = successData.result;
      for (const program of this.programs) {
        for (const solution of program.solutions) {
          for(const entity of solution.entities){
            if (entity.downloaded) {
              downloadedAssessments.push({
                 id : entity._id , 
                 submissionId : entity.submissionId }
                 );
            }
          }
         
        }
      }

    console.log(JSON.stringify(downloadedAssessments))

      if (!downloadedAssessments.length) {
        this.programs = successData.result;
        this.localStorage.setLocalStorage("observationsList", successData.result);
        event ? event.complete() : this.utils.stopLoader();
      } else {
        for (const program of currentPrograms) {
          for (const solution of program.solutions) {
          for (const entity of solution.entities) {
            downloadedAssessments.forEach(  element =>{
              if(element.id === entity._id){
                entity.downloaded = true;
                entity.submissionId = element.submissionId;
              }
            } )
            // if (downloadedAssessments.indexOf(entity._id) >= 0) {
            //   entity.downloaded = true;
            // }
          }
          }
        }
        this.programs = currentPrograms;
        this.localStorage.setLocalStorage("observationsList", currentPrograms);
        event ? event.complete() : this.utils.stopLoader();
      }
    }, error => {
    });

    console.log(JSON.stringify(this.programs))

  }


  getAssessmentDetails(event) {
    let programIndex = event.programIndex;
    let assessmentIndex = event.assessmentIndex ;
    let schoolIndex = event.entityIndex;

    // console.log(programIndex + " " + assessmentIndex + " " + schoolIndex)
    this.utils.startLoader();
    const url = AppConfigs.assessmentsList.detailsOfAssessment+this.programs[programIndex]._id+"?solutionId="+ this.programs[programIndex].solutions[assessmentIndex]._id +"&entityId="+this.programs[programIndex].solutions[assessmentIndex].entities[schoolIndex]._id;
    console.log(url);
    this.apiService.httpGet( url, success => {
      // console.log(JSON.stringify(success.result));
      this.programs[programIndex].solutions[assessmentIndex].entities[schoolIndex].downloaded = true;
      // add submission id to assesment list local storage
      this.programs[programIndex].solutions[assessmentIndex].entities[schoolIndex].submissionId = success.result.assessment.submissionId;
      // console.log(JSON.stringify(success))
      console.log(this.programs[programIndex].solutions[assessmentIndex].entities[schoolIndex].submissionId+"          Submission id =             "+ success.result.assessment.submissionId)
      this.localStorage.setLocalStorage(this.utils.getAssessmentLocalStorageKey(this.programs[programIndex].solutions[assessmentIndex].entities[schoolIndex].submissionId), success.result);
      // this.programs[programIndex].assessments[assessmentIndex].downloaded = true;
      this.localStorage.setLocalStorage("observationsList", this.programs);
      // this.ulsd.mapSubmissionDataToQuestion(success.result);
      this.utils.stopLoader();
    }, error => {
      console.log("error details api")
      this.utils.stopLoader();
    });


  }

  openAction(assessment, aseessmemtData, evidenceIndex) {
    this.utils.setCurrentimageFolderName(aseessmemtData.assessment.evidences[evidenceIndex].externalId, assessment._id)
    const options = { _id: assessment._id, name: assessment.name, selectedEvidence: evidenceIndex, schoolDetails: aseessmemtData };
    this.evdnsServ.openActionSheet(options);
  }

  goToParentDetails() {
    this.navCtrl.push(ProgramDetailsPage)
  }


  goToEcm(event) {

    let submissionId = event.submissionId;
    let heading = event.name;
    console.log(JSON.stringify(event) )

    this.localStorage.getLocalStorage(this.utils.getAssessmentLocalStorageKey(submissionId)).then(successData => {
      
      console.log(JSON.stringify(successData));
    console.log("go to ecm called");


      if (successData.assessment.evidences.length > 1) {

        this.navCtrl.push('EvidenceListPage', { _id: submissionId, name: heading })

      } else {
        if (successData.assessment.evidences[0].startTime) {
          this.utils.setCurrentimageFolderName(successData.assessment.evidences[0].externalId, submissionId)
          this.navCtrl.push('SectionListPage', { _id: submissionId, name: heading, selectedEvidence: 0 })
        } else {
          const assessment = { _id: submissionId, name: heading }
          this.openAction(assessment, successData, 0);
        }
      }
    }).catch(error => {
    })
  }
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
      submissionId:this.programs[programIndex].solutions[assessmentIndex].entities[schoolIndex].submissionId ,
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
