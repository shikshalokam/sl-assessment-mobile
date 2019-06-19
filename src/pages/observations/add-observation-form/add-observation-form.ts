import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, App, Config } from 'ionic-angular';
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
    private storage: Storage
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddObservationPage');

    this.apiProviders.httpGet(AppConfigs.cro.getEntityListType, success => {
      this.entityTypeData = success.result;
      console.log(JSON.stringify(success));
      console.log("success data")
    }, error => {
      console.log("error")
    });

  }


  selectChange(e) {
    console.log(e);
    this.selectedIndex = e;
  }

  checkIndex() {
    console.log('checkIndex func ')
    switch (this.selectedIndex) {

      case 0: this.entityType = this.entityTypeForm.controls.category.value;
        break;
      case 1:
        this.diagnostic.isLocationEnabled().then((isAvailable) => {
          if (isAvailable) {
            this.getLocation();
            console.log("func end")
          }
          else {
            this.networkGps.checkForLocationPermissions();
          }
        }).catch(error => {

        });
        break;
    }

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
    // this.obsData = this.addObservationForm.getRawValue();
    // this.obsData['solutionId'] = this.selectedFrameWork;
    // this.obsData['location'] = this.currentLocation;
    // this.obsData['entityType'] = this.entityTypeForm.getRawValue.category;
    // if (this.addObservationForm.controls.status.value == 'active') {

    // }
    // else {
    // this.localStorage.getLocalStorage('draftObservation').then(draftObs => {
    //   let draft = draftObs
    //   draft.push(this.obsData);
    //   console.log("pushed in array")
    //   this.localStorage.setLocalStorage('draftObservation', draft);

    // }).catch(() => {
    //   this.localStorage.setLocalStorage('draftObservation', [this.obsData]);

    // })
    // }
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
      solutionFlag = true;
    }, error => {

    });
    return solutionFlag;
  }

  getObservationMetaForm() {
    this.apiProviders.httpGet(AppConfigs.cro.getCreateObservationMeta + this.selectedFrameWork._id, success => {
      this.addObservationData = success.result;
      // console.log(JSON.stringify(this.addObservationData))
      this.addObservationData.forEach(element => {
        element['validation'] = { required: true }
      })
      this.addObservationForm = this.utils.createFormGroup(this.addObservationData);
    }, error => {

    });
    // this.diagnostic.isLocationEnabled().then((isAvailable) => {
    //   if (isAvailable) {
    //     this.getLocation();
    //     console.log("func end")

    //   }
    //   else {
    //     this.networkGps.checkForLocationPermissions();
    //   }
    // }).catch(error => {

    // });


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
  saveDraft() {
    let obsData = this.creatPayLoad('draft');
    this.localStorage.getLocalStorage('draftObservation').then(draftObs => {
      let draft = draftObs
      draft.push(obsData);
      this.localStorage.setLocalStorage('draftObservation', draft);
    }).catch(() => {
      this.localStorage.setLocalStorage('draftObservation', [obsData]);
    })
    this.app.getRootNav().pop();
  }

  creatPayLoad(type = 'publish') {
    let payLoad = this.addObservationForm.getRawValue();
    if (type === 'draft') {
      payLoad['solutionId'] = this.selectedFrameWork._id;
      payLoad['entityId'] = this.entityType;
    }
    return payLoad;
  }
}
