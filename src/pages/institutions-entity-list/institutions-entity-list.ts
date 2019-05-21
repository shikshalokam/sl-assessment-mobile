import { Component } from '@angular/core';
import { NavController, NavParams, App, PopoverController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SchoolConfig } from '../../providers/school-list/schoolConfig';
import { ApiProvider } from '../../providers/api/api';
import { UtilsProvider } from '../../providers/utils/utils';
import { WelcomePage } from '../welcome/welcome';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { MenuItemComponent } from '../../components/menu-item/menu-item';
import { UpdateLocalSchoolDataProvider } from '../../providers/update-local-school-data/update-local-school-data';
import { AppConfigs } from '../../providers/appConfig';
import { EvidenceProvider } from '../../providers/evidence/evidence';
import { ProgramDetailsPage } from '../program-details/program-details';

@Component({
  selector: 'institutions-entity-list',
  templateUrl: 'institutions-entity-list.html',
})
export class InstitutionsEntityList {


  // schoolList: Array<object>;
  // schoolDetails = [];
  // enableRefresh = AppConfigs.configuration.enableAssessmentListRefresh;
  // constructor(
  //   public navCtrl: NavController,
  //   public navParams: NavParams,
  //   private storage: Storage,
  //   private apiService: ApiProvider, private appCtrl: App,
  //   private utils: UtilsProvider,
  //   private localStotrage: LocalStorageProvider,
  //   private popoverCtrl: PopoverController,
  //   private ulsd: UpdateLocalSchoolDataProvider) {
  // }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad InstitutionsEntityList');
  //   this.utils.startLoader();
  //   this.localStotrage.getLocalStorage('schools').then(schools => {
  //     this.schoolList = schools;
  //     this.utils.stopLoader();
  //   }).catch(error => {
  //     this.utils.stopLoader();
  //   })
  // }

  // getSchoolListApi(): void {
  //   this.utils.startLoader();
  //   this.apiService.httpGet(SchoolConfig.getSchoolsOfAssessors, response => {
  //     this.schoolList = response.result;
  //     this.storage.set('schools', this.schoolList);
  //   }, error => {
  //     this.utils.stopLoader();
  //     if (error.status == '401') {
  //       this.appCtrl.getRootNav().push(WelcomePage);
  //     }
  //   })
  // }

  // getSchoolDetails(): void {
  //   for (const school of this.schoolList) {
  //     this.apiService.httpGet(SchoolConfig.getSchoolDetails + school['_id'] + '?assessmentType=institutional', this.successCallback, error => {
  //     })
  //   }
  // }

  // getAssessmentDetails(schoolIndex) {
  //   this.utils.startLoader('Fetching school details.');
  //   this.schoolList[schoolIndex]['downloaded'] = true;
  //   this.localStotrage.setLocalStorage('schools', this.schoolList);
  //   this.apiService.httpGet(SchoolConfig.getSchoolDetails + this.schoolList[schoolIndex]['_id'], successData => {
  //     this.localStotrage.setLocalStorage("generalQuestions_" + this.schoolList[schoolIndex]['_id'], successData.result['assessments'][0]['generalQuestions']);
  //     this.localStotrage.setLocalStorage("generalQuestionsCopy_" + this.schoolList[schoolIndex]['_id'], successData.result['assessments'][0]['generalQuestions']);
  //     this.schoolList[schoolIndex]['downloaded'] = true;
  //     this.localStotrage.setLocalStorage(this.utils.getAssessmentLocalStorageKey(this.schoolList[schoolIndex]['_id']), successData.result);
  //     this.ulsd.mapSubmissionDataToQuestion(successData.result);
  //     this.utils.stopLoader();
  //   }, errorData => {
  //     this.utils.stopLoader();

  //   })
  // }

  // refresh(event) {
  //   event ?" " : this.utils.startLoader();
  //   this.apiService.httpGet(SchoolConfig.getSchoolsOfAssessors, response => {
  //     const downloadedAssessments = []
  //     const currentAssessments = response.result;
  //     for (const school of this.schoolList) {
  //       if (school['downloaded']) {
  //         downloadedAssessments.push(school['_id']);
  //       }
  //     }
  //     if (!downloadedAssessments.length) {
  //       this.localStotrage.setLocalStorage("schools", response.result);
  //       event ? event.complete() : this.utils.stopLoader();
  //     } else {
  //       for (const assessment of currentAssessments) {
  //         if (downloadedAssessments.indexOf(assessment._id) >= 0) {
  //           assessment.downloaded = true;
  //         }
  //       }
  //       this.localStotrage.setLocalStorage("schools", currentAssessments);
  //       event ? event.complete() : this.utils.stopLoader();
  //     }
  //   }, error => {

  //   })
  // }


  // gotToEvidenceList(school) {
  //   this.appCtrl.getRootNav().push('EvidenceListPage', { _id: school._id, name: school.name, parent: this })
  // }

  // successCallback = (response) => {
  //   this.schoolDetails.push(response.result);
  //   if (this.schoolDetails.length === this.schoolList.length) {
  //     this.utils.stopLoader();
  //     const schoolDetailsObj = {}
  //     for (const school of this.schoolDetails) {
  //       schoolDetailsObj[school['schoolProfile']._id] = school;
  //     }
  //     this.storage.set('schoolsDetails', JSON.stringify(schoolDetailsObj));
  //   }
  // }

  // goToDetails(index): void {
  //   this.appCtrl.getRootNav().push('EntityProfilePage', { _id: this.schoolList[index]['_id'], name: this.schoolList[index]['name'] })
  // }



  // openMenu(myEvent, index) {
  //   let popover = this.popoverCtrl.create(MenuItemComponent, {
  //     submissionId: this.schoolList[index]['submissionId'],
  //     _id: this.schoolList[index]['_id'],
  //     name: this.schoolList[index]['name'],
  //     programId: this.schoolList['programId']
  //   });
  //   popover.present({
  //     ev: myEvent
  //   });
  // }

  programs: any;
  enableRefresh = AppConfigs.configuration.enableAssessmentListRefresh;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private apiService: ApiProvider,
    private popoverCtrl: PopoverController,
    private localStorage: LocalStorageProvider,
    private ulsd: UpdateLocalSchoolDataProvider,
    private evdnsServ: EvidenceProvider,
    private utils: UtilsProvider) {
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
    const url = AppConfigs.assessmentsList.listOfAssessment + "institutional";
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
      this.localStorage.setLocalStorage("institutionalList", successData.result);
    }, error => {
      console.log("error in list of assessment")
      this.utils.stopLoader()
    })

    console.log("function end")
  }

  refresh(event?: any) {
    const url = AppConfigs.assessmentsList.listOfAssessment + "institutional" ;
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
        this.localStorage.setLocalStorage("institutionalList", successData.result);
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
        this.localStorage.setLocalStorage("institutionalList", currentPrograms);
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
      this.localStorage.setLocalStorage("institutionalList", this.programs);
      // this.ulsd.mapSubmissionDataToQuestion(success.result);
      this.utils.stopLoader();
    }, error => {
      console.log("error details api")
      this.utils.stopLoader();
    });


  }

  openAction(assessment, aseessmemtData, evidenceIndex) {
    this.utils.setCurrentimageFolderName(aseessmemtData.solutions[0].evidences[evidenceIndex].externalId, assessment._id)
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
      
      // console.log(JSON.stringify(successData));
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
      submissionId: "",
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
