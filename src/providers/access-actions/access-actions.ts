import { HttpClient } from '@angular/common/http';
import { App } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { LocalStorageProvider } from '../local-storage/local-storage';
import { UtilsProvider } from '../utils/utils';
import { Diagnostic } from '@ionic-native/diagnostic';
import { ImageListingPage } from '../../pages/image-listing/image-listing';

@Injectable()
export class AccessActionsProvider {

  constructor(public http: HttpClient, 
    private utils: UtilsProvider,
    private diagnostic : Diagnostic,
    private localStorage: LocalStorageProvider,
    // private navCntrl: NavController,
    private app: App
    ) {
    console.log('Hello AccessActionsProvider Provider');
  }

  ActionEnableSubmit(actionDetails) {
    let currentEcm;
    this.localStorage.getLocalStorage('schoolDetails_'+ actionDetails.schoolId).then( data => {
      const currentSchoolData = data;
      for (const evidenc of currentSchoolData.assessments[0].evidences) {
        if(evidenc.externalId === actionDetails.evidenceCollectionMethod) {
          currentEcm = evidenc;
          break;
        }
      }
      if(actionDetails.action[0] === 'enableSubmission') {
        currentEcm['enableSubmit'] = true;
      }
      this.localStorage.setLocalStorage("schoolDetails_"+actionDetails.schoolId, currentSchoolData);
      this.utils.openToast(actionDetails.successMessage);
    }).catch(error => {
    })
  }

    ActionAutoSubmit(actionDetails) {
      this.diagnostic.isLocationEnabled().then(success => {
        const params = {
          selectedEvidenceId: null,
          _id: actionDetails.schoolId,
          name: "",
          selectedEvidence: null,
          
        }
        if (success) {
          this.localStorage.getLocalStorage("schoolDetails_"+actionDetails.schoolId).then( successData => {
            const evidences = successData['assessments'][0] ? successData['assessments'][0]['evidences'] : successData['assessments']['evidences'];
            let index = 0;
            for (const evidence of successData) {
              if(evidence.externalId === actionDetails.evidenceCollectionMethod) {
                params.selectedEvidenceId = index;
                break
              }
              index ++;
            }
          this.app.getActiveNav().push(ImageListingPage, params);

          }).catch (error => {

          })
        
          // this.navCntrl.push(ImageListingPage, params);
        } else {
        }
      }).catch(error => {
      })
  }

}
