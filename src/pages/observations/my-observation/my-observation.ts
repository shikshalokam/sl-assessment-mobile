import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, App } from 'ionic-angular';
import { ApiProvider } from '../../../providers/api/api';
import { FormGroup } from '@angular/forms';
import { UtilsProvider } from '../../../providers/utils/utils';
import { SolutionDetailsPage } from '../../solution-details/solution-details';
import { AddObservationFormPage } from '../add-observation-form/add-observation-form';
import { LocalStorageProvider } from '../../../providers/local-storage/local-storage';

@IonicPage()
@Component({
  selector: 'page-add-observation',
  templateUrl: 'my-observation.html',
})
export class MyObservationPage {
  observationStatus='all'
  statusOption = [
    {
      label:"All",
      value:'all'
    },
    {
      label:"Draft",
      value:'draft'
    },
    {
      label:"In Progress",
      value:'inProgress'
    },
    {
      label:"In Active",
      value:"inActive"
    }
  ]


  addObservationData: {};
  addObservationForm: FormGroup;
  selectedFrameWork;
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
  draftObservation: any;
  observationList = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public apiProviders: ApiProvider,
    public utils: UtilsProvider,
    private modalCtrl: ModalController,
    private app :App,
    private localStorage : LocalStorageProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddObservationPage');
    this.apiProviders.getLocalJson('assets/addObservation.json').subscribe(successData => {
      this.addObservationData = JSON.parse(successData['_body']).form;
      console.log(JSON.stringify(this.addObservationData));

      this.addObservationForm = this.utils.createFormGroup(this.addObservationData);
    },
      error => {

      })
  }

  saveDraft() {

  }
  addObservation() {
    console.log("called add Observation")
      const params = {
      }
      // this.app.getRootNav().setRoot(AddObservationFormPage, { data: params});

this.app.getRootNav().push(AddObservationFormPage, { data: params})
      // let addObservationForm = this.navCtrl.push(AddObservationFormPage, { data: params});
      // addObservationForm.onDidDismiss(data => {
      //   if (data) {
      //     // data.programId = this.entityDetails['program']._id;
      //     //console.log("Dismiss with valid data")
      //     // data.entityId = this.entityId;
      //     // data.entityName = this.entityName;
      //     // this.registryList.push(data);
      //     // this.showUploadBtn = this.checkForUploadBtn();
      //     // this.localStorage.setLocalStorage(this.registryType + 'Details_' + this.submissionId, this.registryList)
      //   }
      // })
      // addObservationForm.present();
  }
  selectSolution(frameWork) {
    this.selectedFrameWork = frameWork;
  }
  showDetails(frameWork) {
    let contactModal = this.navCtrl.push(SolutionDetailsPage, { data: frameWork });
    // contactModal.present();
  }
  changeObservationStatus(){
    // this.observationStatus = status.value;
    console.log(this.observationStatus);
    if (this.observationStatus === 'draft'){

      this.localStorage.getLocalStorage('draftObservation').then(draftObs =>{
        this.observationList = draftObs ;
      }).catch(error =>{

      })
    }
  }
}
