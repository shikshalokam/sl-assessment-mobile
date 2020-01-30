import { Component } from '@angular/core';
import { NavController, Events, Platform , PopoverController} from 'ionic-angular';
import { CurrentUserProvider } from '../../providers/current-user/current-user';
import { Network } from '@ionic-native/network';
import { InstitutionsEntityList } from '../institutions-entity-list/institutions-entity-list';
import { IndividualListingPage } from '../individual-listing/individual-listing';
import { ObservationsPage } from '../observations/observations';
import { SharingFeaturesProvider } from '../../providers/sharing-features/sharing-features';
import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { ApiProvider } from '../../providers/api/api';
import { AppConfigs } from '../../providers/appConfig';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { UtilsProvider } from '../../providers/utils/utils';
import { RoleListingPage } from '../role-listing/role-listing';
import { EvidenceProvider } from '../../providers/evidence/evidence';
import { AssessmentServiceProvider } from '../../providers/assessment-service/assessment-service';
import { ObservationDetailsPage } from '../observation-details/observation-details';
import { GenericMenuPopOverComponent } from '../../components/generic-menu-pop-over/generic-menu-pop-over';
import { ObservationProvider } from '../../providers/observation/observation';
import { SidemenuProvider } from '../../providers/sidemenu/sidemenu';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  userData: any;
  schoolList: Array<object>;
  schoolDetails = [];
  evidences: any;
  subscription: any;
  networkAvailable: boolean;
  isIos: boolean = this.platform.is('ios');
  parentList: any = [];
  errorMsg: string;
  generalQuestions: any;
  schoolIndex = 0;
  currentProgramId: any;
  profileRoles;
  dashboardEnable: boolean;
  allPages: Array<Object> = [

    {
      name: "institutional",
      subName: 'assessments',
      icon: "book",
      component: InstitutionsEntityList,
      active: false
    },
    {
      name: "individual",
      subName: 'assessments',
      icon: "person",
      component: IndividualListingPage,
      active: false
    },
    {
      name: "observations",
      subName: '',
      icon: "eye",
      component: ObservationsPage,
      active: false
    },

  ]
  recording: boolean = false;
  filePath: string;
  fileName: string;
  audio: MediaObject;
  audioList: any[] = [];
  canViewLoad: boolean = false;
  pages;
  recentlyModifiedAssessment: any;
  institutionalAssessments ;
  individualAssessments;
  observations;
  observationSubscription
  constructor(public navCtrl: NavController,
    private currentUser: CurrentUserProvider,
    private network: Network,
    private evdnsServ :EvidenceProvider,
    private popoverCtrl : PopoverController,
    private media: Media,
    private currentUserProvider: CurrentUserProvider,
    private localStorageProvider: LocalStorageProvider,
    private file: File,
    private events: Events,
    private sharingFeature: SharingFeaturesProvider,
    private platform: Platform,
    private apiService: ApiProvider,
    private localStorage: LocalStorageProvider,
    private apiProvider: ApiProvider,
    private utils: UtilsProvider,
    private assessmentService: AssessmentServiceProvider,
    private observationService: ObservationProvider,
    private sidemenuProvider: SidemenuProvider
  ) {


    this.isIos = this.platform.is('ios') ? true : false;
    


  }

  ionViewDidLoad() {
    this.userData = this.currentUser.getCurrentUserData();
    this.navCtrl.id = "HomePage";
    this.sidemenuProvider.getUserRoles();

    if (this.network.type != 'none') {
      this.networkAvailable = true;
    }

    this.localStorage.getLocalStorage('staticLinks').then(success => {
      if (success) {
      } else {
        this.getStaticLinks();
      }
    }).catch(error => {
      this.getStaticLinks();
    })

   
  }

  getIndividualAssessmentFromLocal() {
    this.localStorage.getLocalStorage('individualList').then(data => {
      if (data) {
        this.individualAssessments = data;
      } else {
        this.getIndividualAssessmentsApi();
      }
    }).catch(error => {
      this.getIndividualAssessmentsApi();
    })
  }

  getInstitutionalAssessmentsFromLocal() {
    this.localStorage.getLocalStorage('institutionalList').then(data => {
      if (data) {
        this.institutionalAssessments = data;

      } else {
        this.getInstitutionalAssessmentsApi();
      }
    }).catch(error => {
      this.getInstitutionalAssessmentsApi();
    })
  }



  getIndividualAssessmentsApi() {
    this.assessmentService.getAssessmentsApi ('individual', true).then(programs =>{
      this.individualAssessments = programs;
    }).catch(error=>{
    })
    

  }

  getInstitutionalAssessmentsApi() {
    this.assessmentService.getAssessmentsApi('institutional', true).then(programs => {
      this.institutionalAssessments = programs;
    }).catch(error=>{
    })
  }

  getObservationListFromLocal() {
    this.localStorage.getLocalStorage('createdObservationList').then(data => {
      if (data) {
        this.observations = data;
      } else {
        this.getObservationsFromApi();
      }

    }).catch(error => {
      this.getObservationsFromApi();

    })
  }

  navigateToCreatedObservationDetails(index) {
    this.navCtrl.push(ObservationDetailsPage, { selectedObservationIndex: index })

  }

  getObservationsFromApi() {
    this.apiProvider.httpGet(AppConfigs.cro.observationList, success => {
      this.observations = success.result;
      this.observations.forEach(element => {
        if (element.entities.length >= 0) {
          element.entities.forEach(entity => {
            // entity.downloaded = false;
            if(entity.submissions && entity.submissions.length > 0){
              entity.submissions.forEach( submission =>{
                submission['downloaded'] = false;
              })
            }
          });
        }
      });
      this.localStorage.setLocalStorage('createdObservationList', this.observations);
    }, error => {
     }, {version:"v2"})
  }

  openMenu(event , index) {
    // this.assessmentService.openMenu(event, this.programs, false);
    // console.log("open menu")
    // let popover = this.popoverCtrl.create(GenericMenuPopOverComponent , { showAbout : true ,showEdit : true , assessmentIndex : index , assessmentName :'createdObservationList'})
    let popover = this.popoverCtrl.create(GenericMenuPopOverComponent , { "isObservation": true,"showAbout" : true ,"showEdit" : true , "assessmentIndex" : index , "assessmentName" :'createdObservationList'})
  
    popover.present(
      {ev:event}
      );
      
  }

  ionViewDidEnter(){
    // console.log("home page enter")
    // this.localStorage.getLocalStorage('recentlyModifiedAssessment').then(succcess=>{
    //   this.recentlyModifiedAssessment = succcess;
    //   console.log(JSON.stringify(this.recentlyModifiedAssessment));
    //   console.log("LAST MODEFIED AT ARRAY")
    // }).catch(error =>{
    //   console.log("LAST MODEFIED AT ARRAY IS BLANK")
    // });

    this.getInstitutionalAssessmentsFromLocal();
    this.getIndividualAssessmentFromLocal();
    this.getObservationListFromLocal();
  }


  socialSharingInApp() {
    this.sharingFeature.sharingThroughApp();
  }

  getStaticLinks() {
    this.apiService.httpGet(AppConfigs.externalLinks.getStaticLinks, success => {
      this.localStorage.setLocalStorage('staticLinks', success.result);
    }, error => {
    });
  }

  goToPage(index) {
    this.events.publish('navigateTab', index >= 0 ? this.allPages[index]['name'] : 'dashboard')
  }

  ionViewWillLeave() {
    console.log("inside will leave")
    this.events.unsubscribe('multipleRole');
    this.observationSubscription ? this.observationSubscription.unsubscribe() : null;
  }

  ionViewWillEnter() {
    this.observationSubscription = this.observationService.observationListUpdate.subscribe(success => {
      this.getObservationsFromApi();
    }, error => {
    })
  }


  goToRecentlyUpdatedAssessment(assessment){
    // this.utils.getAssessmentLocalStorageKey(assessment.submissionId)



    let submissionId = assessment.submissionId
    let heading = assessment.EntityName;
    let recentlyUpdatedEntity = {
      programName :assessment.programName,
      ProgramId :assessment.ProgramId,
      EntityName : assessment.EntityName,
      EntityId :assessment.EntityId,
      submissionId:submissionId,
      isObservation : assessment.isObservation
    }
    // console.log("go to ecm called" + submissionId );

    this.localStorage.getLocalStorage(this.utils.getAssessmentLocalStorageKey(submissionId)).then(successData => {

      // console.log(JSON.stringify(successData));
      //console.log("go to ecm called");

      // successData = this.updateTracker.getLastModified(successData , submissionId)
      // console.log("after modification")
      if (successData.assessment.evidences.length > 1) {

        this.navCtrl.push('EvidenceListPage', { _id: submissionId, name: heading ,recentlyUpdatedEntity : recentlyUpdatedEntity})

      } else {
        if (successData.assessment.evidences[0].startTime) {
          //console.log("if loop " + successData.assessment.evidences[0].externalId)
          this.utils.setCurrentimageFolderName(successData.assessment.evidences[0].externalId, submissionId)
          this.navCtrl.push('SectionListPage', { _id: submissionId, name: heading, selectedEvidence: 0  ,recentlyUpdatedEntity : recentlyUpdatedEntity})
        } else {

          const assessment = { _id: submissionId, name: heading ,recentlyUpdatedEntity : recentlyUpdatedEntity}
          this.openAction(assessment, successData, 0);
          //console.log("else loop");

        }
      }
    }).catch(error => {
    });

  }

  openAction(assessment, aseessmemtData, evidenceIndex) {
    this.utils.setCurrentimageFolderName(aseessmemtData.assessment.evidences[evidenceIndex].externalId, assessment._id)
    const options = { _id: assessment._id, name: assessment.name,recentlyUpdatedEntity : assessment.recentlyUpdatedEntity ,selectedEvidence: evidenceIndex, entityDetails: aseessmemtData };
    this.evdnsServ.openActionSheet(options);
  }

}
