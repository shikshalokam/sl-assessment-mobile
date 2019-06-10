import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { FormGroup } from '@angular/forms';
import { ApiProvider } from '../../../providers/api/api';
import { UtilsProvider } from '../../../providers/utils/utils';
import { SolutionDetailsPage } from '../../solution-details/solution-details';
import { SchoolListPage } from './school-list/school-list';

/**
 * Generated class for the AddObservationFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-observation-form',
  templateUrl: 'add-observation-form.html',
})
export class AddObservationFormPage {
  addObservationData: {};
  addObservationForm: FormGroup;
  selectedFrameWork;
  selectedSchools = [];
  schoolList = [];
  schools = [];
  index =0;
  @ViewChild('stepper') stepper1 : ElementRef;
  listOfFrameWork = [
    [
      {
        _id: "5beaaa2baf0065f0e0a105c7",
        externalId: "Apple-Assessment-Framework-2018-001",
        name: "Apple Assessment Framework 2018-001",
        description: "Apple Assessment Framework 2018-001",
        author: "a082787f-8f8f-42f2-a706-35457ca6f1fd",
        parentId: null,
        startDate : "21 July 2019",
        endDate : "21 August 2019",
        resourceType: [
          "Assessment Framework"
        ],
        language: [
          "English"
        ],
        keywords: [
          "Framework",
          "Assessment"
        ],
        levelToScoreMapping: {
          L1: {
            points: 25,
            label: "Not Good"
          },
          L2: {
            points: 50,
            label: "Decent"
          },
          L3: {
            points: 75,
            label: "Good"
          },
          L4: {
            points: 100,
            label: "Best"
          }
        },
        entityType: "school",
        type: "assessment",
        subType: "institutional",
      },
      {
        _id: "5beaaa2baf0065f0e0a105c7",
        externalId: "Apple-Assessment-Framework-2018-001",
        name: "Apple Assessment Framework 2018-001",
        description: "Apple Assessment Framework 2018-001",
        author: "a082787f-8f8f-42f2-a706-35457ca6f1fd",
        parentId: null,
        startDate : "21 July 2019",
        endDate : "21 August 2019",
        resourceType: [
          "Assessment Framework"
        ],
        language: [
          "English"
        ],
        keywords: [
          "Framework",
          "Assessment"
        ],
        levelToScoreMapping: {
          L1: {
            points: 25,
            label: "Not Good"
          },
          L2: {
            points: 50,
            label: "Decent"
          },
          L3: {
            points: 75,
            label: "Good"
          },
          L4: {
            points: 100,
            label: "Best"
          }
        },
        entityType: "school",
        type: "assessment",
        subType: "institutional",
      },
      {
        _id: "5beaaa2baf0065f0e0a105c7",
        externalId: "Apple-Assessment-Framework-2018-001",
        name: "Apple Assessment Framework 2018-001",
        description: "Apple Assessment Framework 2018-001",
        author: "a082787f-8f8f-42f2-a706-35457ca6f1fd",
        parentId: null,
        startDate : "21 July 2019",
        endDate : "21 August 2019",
        resourceType: [
          "Assessment Framework"
        ],
        language: [
          "English"
        ],
        keywords: [
          "Framework",
          "Assessment"
        ],
        levelToScoreMapping: {
          L1: {
            points: 25,
            label: "Not Good"
          },
          L2: {
            points: 50,
            label: "Decent"
          },
          L3: {
            points: 75,
            label: "Good"
          },
          L4: {
            points: 100,
            label: "Best"
          }
        },
        entityType: "school",
        type: "assessment",
        subType: "institutional",
      },
      {
        _id: "5beaaa2baf0065f0e0a105c7",
        externalId: "Apple-Assessment-Framework-2018-001",
        name: "Apple Assessment Framework 2018-001",
        description: "Apple Assessment Framework 2018-001",
        author: "a082787f-8f8f-42f2-a706-35457ca6f1fd",
        parentId: null,
        startDate : "21 July 2019",
        endDate : "21 August 2019",
        resourceType: [
          "Assessment Framework"
        ],
        language: [
          "English"
        ],
        keywords: [
          "Framework",
          "Assessment"
        ],
        levelToScoreMapping: {
          L1: {
            points: 25,
            label: "Not Good"
          },
          L2: {
            points: 50,
            label: "Decent"
          },
          L3: {
            points: 75,
            label: "Good"
          },
          L4: {
            points: 100,
            label: "Best"
          }
        },
        entityType: "school",
        type: "assessment",
        subType: "institutional",
      },
      {
        _id: "5beaaa2baf0065f0e0a105c7",
        externalId: "Apple-Assessment-Framework-2018-001",
        name: "Apple Assessment Framework 2018-001",
        description: "Apple Assessment Framework 2018-001",
        author: "a082787f-8f8f-42f2-a706-35457ca6f1fd",
        parentId: null,
        startDate : "21 July 2019",
        endDate : "21 August 2019",
        resourceType: [
          "Assessment Framework"
        ],
        language: [
          "English"
        ],
        keywords: [
          "Framework",
          "Assessment"
        ],
        levelToScoreMapping: {
          L1: {
            points: 25,
            label: "Not Good"
          },
          L2: {
            points: 50,
            label: "Decent"
          },
          L3: {
            points: 75,
            label: "Good"
          },
          L4: {
            points: 100,
            label: "Best"
          }
        },
        entityType: "school",
        type: "assessment",
        subType: "institutional",
      }

    ],
    [
      {
        _id: "5beaaa2baf0065f0e0a105c7",
        externalId: "Apple-Assessment-Framework-2018-001",
        name: "Apple Assessment Framework 2018-001",
        description: "Apple Assessment Framework 2018-001",
        author: "a082787f-8f8f-42f2-a706-35457ca6f1fd",
        parentId: null,
        startDate : "21 July 2019",
        endDate : "21 August 2019",
        resourceType: [
          "Assessment Framework"
        ],
        language: [
          "English"
        ],
        keywords: [
          "Framework",
          "Assessment"
        ],
        levelToScoreMapping: {
          L1: {
            points: 25,
            label: "Not Good"
          },
          L2: {
            points: 50,
            label: "Decent"
          },
          L3: {
            points: 75,
            label: "Good"
          },
          L4: {
            points: 100,
            label: "Best"
          }
        },
        entityType: "school",
        type: "assessment",
        subType: "institutional",
      },
      {
        _id: "5beaaa2baf0065f0e0a105c7",
        externalId: "Apple-Assessment-Framework-2018-001",
        name: "Apple Assessment Framework 2018-001",
        description: "Apple Assessment Framework 2018-001",
        author: "a082787f-8f8f-42f2-a706-35457ca6f1fd",
        parentId: null,
        startDate : "21 July 2019",
        endDate : "21 August 2019",
        resourceType: [
          "Assessment Framework"
        ],
        language: [
          "English"
        ],
        keywords: [
          "Framework",
          "Assessment"
        ],
        levelToScoreMapping: {
          L1: {
            points: 25,
            label: "Not Good"
          },
          L2: {
            points: 50,
            label: "Decent"
          },
          L3: {
            points: 75,
            label: "Good"
          },
          L4: {
            points: 100,
            label: "Best"
          }
        },
        entityType: "school",
        type: "assessment",
        subType: "institutional",
      },
      {
        _id: "5beaaa2baf0065f0e0a105c7",
        externalId: "Apple-Assessment-Framework-2018-001",
        name: "Apple Assessment Framework 2018-001",
        description: "Apple Assessment Framework 2018-001",
        author: "a082787f-8f8f-42f2-a706-35457ca6f1fd",
        parentId: null,
        startDate : "21 July 2019",
        endDate : "21 August 2019",
        resourceType: [
          "Assessment Framework"
        ],
        language: [
          "English"
        ],
        keywords: [
          "Framework",
          "Assessment"
        ],
        levelToScoreMapping: {
          L1: {
            points: 25,
            label: "Not Good"
          },
          L2: {
            points: 50,
            label: "Decent"
          },
          L3: {
            points: 75,
            label: "Good"
          },
          L4: {
            points: 100,
            label: "Best"
          }
        },
        entityType: "school",
        type: "assessment",
        subType: "institutional",
      },
      {
        _id: "5beaaa2baf0065f0e0a105c7",
        externalId: "Apple-Assessment-Framework-2018-001",
        name: "Apple Assessment Framework 2018-001",
        description: "Apple Assessment Framework 2018-001",
        author: "a082787f-8f8f-42f2-a706-35457ca6f1fd",
        parentId: null,
        startDate : "21 July 2019",
        endDate : "21 August 2019",
        resourceType: [
          "Assessment Framework"
        ],
        language: [
          "English"
        ],
        keywords: [
          "Framework",
          "Assessment"
        ],
        levelToScoreMapping: {
          L1: {
            points: 25,
            label: "Not Good"
          },
          L2: {
            points: 50,
            label: "Decent"
          },
          L3: {
            points: 75,
            label: "Good"
          },
          L4: {
            points: 100,
            label: "Best"
          }
        },
        entityType: "school",
        type: "assessment",
        subType: "institutional",
      },
      {
        _id: "5beaaa2baf0065f0e0a105c7",
        externalId: "Apple-Assessment-Framework-2018-001",
        name: "Apple Assessment Framework 2018-001",
        description: "Apple Assessment Framework 2018-001",
        author: "a082787f-8f8f-42f2-a706-35457ca6f1fd",
        parentId: null,
        startDate : "21 July 2019",
        endDate : "21 August 2019",
        resourceType: [
          "Assessment Framework"
        ],
        language: [
          "English"
        ],
        keywords: [
          "Framework",
          "Assessment"
        ],
        levelToScoreMapping: {
          L1: {
            points: 25,
            label: "Not Good"
          },
          L2: {
            points: 50,
            label: "Decent"
          },
          L3: {
            points: 75,
            label: "Good"
          },
          L4: {
            points: 100,
            label: "Best"
          }
        },
        entityType: "school",
        type: "assessment",
        subType: "institutional",
      }

    ]
    
  ]
  selectedIndex: any = 0;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public apiProviders: ApiProvider,
    public utils: UtilsProvider,
    private modalCtrl: ModalController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddObservationPage');
    this.apiProviders.getLocalJson('assets/addObservation.json').subscribe(successData => {
      this.addObservationData = JSON.parse(successData['_body']).form;
      this.addObservationForm = this.utils.createFormGroup(this.addObservationData);
    },

      error => {
      });
      this.apiProviders.getLocalJson('assets/schoolList.json').subscribe(schoolLists => {

        this.schools = JSON.parse(schoolLists['_body']).form;

        this.schools.forEach(element => {
          element.selected = false;
        });
       if(this.schools){
        for (; (this.index < 10 )&& (this.index < this.schools.length); ) {
          // console.log(this.schools[this.index].name)
          this.schoolList.push( this.schools[this.index++]);
        }
       }
       console.log(this.stepper1 );
       console.log("stepper")
       
      },
  
        error => {
  
        });

  }
 

  selectChange(e) {
    console.log(e);
    this.selectedIndex = e ;
  }
  saveDraft() {

  }
  addObservation() {

  }
  selectSolution(frameWork) {
    this.selectedFrameWork = frameWork;
  }
  showDetails(frameWork) {
    let contactModal = this.modalCtrl.create(SolutionDetailsPage, { data: frameWork });
    contactModal.present();
  }
  openSchoolListmodal(){
   let schoolListModal =  this.modalCtrl.create(SchoolListPage, {
     schoolList : this.schoolList,
     schools: this.schools,
     index: this.index
     }) ;
     schoolListModal.onDidDismiss( schoolList => {
      this.selectedSchools = schoolList;
      console.log(this.selectedSchools.length)
     });
    schoolListModal.present();


  }
}
