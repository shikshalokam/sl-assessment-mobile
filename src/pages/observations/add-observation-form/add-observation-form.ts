import { Component, ViewChild, ElementRef, ɵConsole } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, App, Config, Events } from 'ionic-angular';
import { FormGroup, Validators } from '@angular/forms';
import { ApiProvider } from '../../../providers/api/api';
import { UtilsProvider } from '../../../providers/utils/utils';
import { SolutionDetailsPage } from '../../solution-details/solution-details';
import { EntityListPage } from './entity-list/entity-list';
import { NetworkGpsProvider } from '../../../providers/network-gps/network-gps';
import { LocalStorageProvider } from '../../../providers/local-storage/local-storage';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { AppConfigs } from '../../../providers/appConfig';

/**
 * Generated class for the AddObservationFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
export interface draftData{

}
@IonicPage()
@Component({
  selector: 'page-add-observation-form',
  templateUrl: 'add-observation-form.html',
})
export class AddObservationFormPage {
  addObservationData;
  addObservationForm: FormGroup;
  selectedFrameWork;
  selectedSchools = [];

  index = 0;
  @ViewChild('stepper') stepper1: ElementRef;
  listOfSolution;
  selectedIndex: any = 0;
  entityTypeData: any;
  entityTypeForm: any;
  currentLocation: any;
  obsData: any;
  entityType: any;
  saveDraftType: string = 'force';
  editData: any;
  editDataIndex: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private permissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private geolocation: Geolocation,
    public apiProviders: ApiProvider,
    private diagnostic: Diagnostic,
    public utils: UtilsProvider,
    private modalCtrl: ModalController,
    private networkGps: NetworkGpsProvider,
    private localStorage: LocalStorageProvider,
    private app: App,
    private storage: Storage,
    private event :Events
  ) {
    this.editData  = this.navParams.get('data');
    console.log(JSON.stringify(this.navParams.get('data')));
    this.editDataIndex  = this.navParams.get('index');

    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddObservationPage');

    this.apiProviders.httpGet(AppConfigs.cro.getEntityListType, success => {
      this.entityTypeData = success.result;
      console.log(JSON.stringify(success));
      console.log("success data")
      if(this.editData){
        this.entityType = this.editData.data.entityId;
      }
    }, error => {
      console.log("error")
    });

  }


  selectChange(e) {
    console.log(e);
    this.selectedIndex = e;
  }

  

  getLocation() {
    this.utils.startLoader();
    const options = {
      timeout: 2000
    }

    console.log('Check permissions');
    this.permissions.checkPermission(this.permissions.PERMISSION.ACCESS_FINE_LOCATION).then(
      result => {
        console.log('Has permission?', result.hasPermission)
        if (!result.hasPermission) {
          console.log("ask permission");
          this.permissions.requestPermission(this.permissions.PERMISSION.ACCESS_FINE_LOCATION).then(result => {
            if (result.hasPermission) {
              this.locationAccuracy.canRequest().then((canRequest: boolean) => {
                if (canRequest) {
                  this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                    () => {
                      this.geolocation.getCurrentPosition(options).then((resp) => {
                        this.currentLocation = resp.coords.latitude + "," + resp.coords.longitude;
                        console.log(resp.coords.latitude + " " + resp.coords.longitude)

                      }).catch((error) => {
                        console.log(error.message + " " + error.code);

                        this.storage.get('gpsLocation').then(success => {
                          this.currentLocation = success

                        }).catch(error => {

                        })
                      });
                    }).catch(
                      error => {
                        this.utils.openToast("Location should be turned on for this action");
                        this.utils.stopLoader();
                      }
                    );
                } else {
                  this.geolocation.getCurrentPosition(options).then((resp) => {
                    this.currentLocation = resp.coords.latitude + "," + resp.coords.longitude;
                    console.log(resp.coords.latitude + " " + resp.coords.longitude)
                  }).catch((error) => {
                    console.log(error.message + " " + error.code);

                    this.storage.get('gpsLocation').then(success => {
                      this.currentLocation = success

                    }).catch(error => {

                    })
                  });
                  // })
                }

              });
            }
          }).catch(error => {
            console.log('error')
          })
        } else {
          console.log('yes, Has permission');
          this.locationAccuracy.canRequest().then((canRequest: boolean) => {
            if (canRequest) {
              this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                () => {
                  this.geolocation.getCurrentPosition(options).then((resp) => {
                    this.currentLocation = resp.coords.latitude + "," + resp.coords.longitude;
                    this.storage.set('currentLocation', this.currentLocation)
                    console.log(resp.coords.latitude + " " + resp.coords.longitude)

                  }).catch((error) => {
                    console.log(error.message + " " + error.code);

                    this.storage.get('gpsLocation').then(success => {
                      this.currentLocation = success

                    }).catch(error => {

                    })
                  });
                }).catch(
                  error => {
                    this.utils.openToast("Location should be turned on for this action");
                  }
                );
            } else {
              //For ios devices
              this.geolocation.getCurrentPosition(options).then((resp) => {
                this.currentLocation = resp.coords.latitude + "," + resp.coords.longitude;
                this.storage.set('currentLocation', this.currentLocation)
                console.log(resp.coords.latitude + " " + resp.coords.longitude)


              }).catch((error) => {
                console.log(error.message + " " + error.code);

                this.storage.get('gpsLocation').then(success => {
                  this.currentLocation = success
                }).catch(error => {

                })
              });
            }

          });
        }
      }).catch(error => {
      });


    console.log("Getting current location");

    this.utils.stopLoader();

  }
  addObservation() {
      this.app.getRootNav().pop();

  }
  selectSolution(frameWork) {
    this.selectedFrameWork = frameWork;
  }
  showDetails(frameWork) {
    let contactModal = this.modalCtrl.create(SolutionDetailsPage, { data: frameWork });
    contactModal.present();
  }
  getSolutionList() {
    let solutionFlag = false;
    this.apiProviders.httpGet(AppConfigs.cro.getSolutionAccordingToType + this.entityType, success => {
      this.listOfSolution = success.result;
      console.log(JSON.stringify(this.listOfSolution))
      if( this.editData && this.editData.data.solutionId ){
        this.listOfSolution.forEach(element => {
        if(  element._id === this.editData.data.solutionId )
        this.selectedFrameWork = element._id;
        });
      }
      solutionFlag = true;
    }, error => {

    });
    return solutionFlag;
  }

  getObservationMetaForm() {
    this.apiProviders.httpGet(AppConfigs.cro.getCreateObservationMeta + this.selectedFrameWork, success => {
      this.addObservationData = success.result;
      if(this.editData) {
      this.addObservationData.forEach(element => {
        element.value = this.editData.data[element.field] ;
        if(element.field === 'status'){
          element.value = 'draft';
        }
      });
    
    }
      this.addObservationForm = this.utils.createFormGroup(this.addObservationData);
    }, error => {

    });
    return (this.addObservationForm && this.currentLocation) ? true : false;
  }
  doAction() {
    let actionFlag = false;
    switch (this.selectedIndex) {
      case 0:
        actionFlag = this.entityType ? this.getSolutionList() : false;
        break;
      case 1:
        actionFlag = this.selectedFrameWork ? this.getObservationMetaForm() : false;
        break;

    }
    return actionFlag;
  }
  tmpFunc() { }
  saveDraft(option = 'normal') {
    
   if(this.entityType){
    let obsData :{} = {
      data:{}
    };
     obsData['data'] = this.creatPayLoad('draft');
    
      obsData['data']['isComplete'] = this.addObservationForm?this.addObservationForm.valid ? true : false : false;

      console.log(JSON.stringify(obsData))
    this.localStorage.getLocalStorage('draftObservation').then(draftObs => {
      let draft = draftObs;
      console.log(JSON.stringify(obsData))
      this.editDataIndex >= 0 ?  draft[this.editDataIndex] = obsData  : draft.push(obsData);
      this.localStorage.setLocalStorage('draftObservation', draft);
      option == 'normal' ? this.navCtrl.pop() :  this.event.publish('draftObservationArrayReload');
    
    }).catch(() => {
      this.localStorage.setLocalStorage('draftObservation', [obsData]);
      option == 'normal' ? this.navCtrl.pop() :  this.event.publish('draftObservationArrayReload');
    })

    
  }

}

  creatPayLoad(type = 'publish') {
    let payLoad = this.addObservationForm ?  this.addObservationForm.getRawValue() : {};
    if (type === 'draft') {
      payLoad['isComplete']= false;
      payLoad['solutionId'] = this.selectedFrameWork ? this.selectedFrameWork : null;
      payLoad['entityId'] = this.entityType ? this.entityType : null ;
    }
    console.log(JSON.stringify(payLoad))
    return payLoad;
  }


  ionViewWillUnload(){


    console.log("function called on leave");
    if(this.saveDraftType !== 'normal')
      this.saveDraft('force');
  }

}
