import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActionSheetController, App } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UtilsProvider } from '../utils/utils';
import { Diagnostic } from '@ionic-native/diagnostic';
import { NetworkGpsProvider } from '../network-gps/network-gps';

/*
  Generated class for the EvidenceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EvidenceProvider {
  schoolData: any;

  constructor(public http: HttpClient, private actionSheet: ActionSheetController,
    private appCtrl: App, private storage: Storage, private utils: UtilsProvider,
    private diagnostic: Diagnostic, private netwrkGpsProvider: NetworkGpsProvider) {
    console.log('Hello EvidenceProvider Provider');
    this.storage.get('schools').then(data => {
      this.schoolData = data;
    })
  }

  openActionSheet(params): void {

    let action = this.actionSheet.create({
      title: "Survey actions",
      buttons: [
        {
          text: "View Survey",
          role: 'destructive',
          icon: "eye",
          handler: () => {
            delete params.schoolDetails;
            this.appCtrl.getRootNav().push('SectionListPage', params);
          }
        },
        {
          text: "Start Survey",
          icon: 'arrow-forward',
          handler: () => {
            this.diagnostic.isLocationEnabled().then(success => {
              console.log(success)
              if (success) {
                params.schoolDetails[params._id]['assessments'][0]['evidences'][params.selectedEvidence].startTime = Date.now();
                this.utils.setLocalSchoolData(params.schoolDetails);
                delete params.schoolDetails;
                this.appCtrl.getRootNav().push('SectionListPage', params);
              } else {
                this.netwrkGpsProvider.checkForLocationPermissions();
              }
            }).catch(error => {
              this.netwrkGpsProvider.checkForLocationPermissions();
            })
          }
        }
      ]
    })
    action.present();
  }

}
