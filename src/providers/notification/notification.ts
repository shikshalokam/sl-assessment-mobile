import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ApiProvider } from '../api/api';
import { AppConfigs } from '../appConfig';
import { LocalStorageProvider } from '../local-storage/local-storage';
import { ObservationServiceProvider } from '../observation-service/observation-service';
import { ObservationDetailsPage } from '../../pages/observation-details/observation-details';
import { App } from 'ionic-angular';
import { UtilsProvider } from '../utils/utils';
import { AssessmentServiceProvider } from '../assessment-service/assessment-service';
import { EntityListingPage } from '../../pages/entity-listing/entity-listing';
import { NetworkGpsProvider } from '../network-gps/network-gps';
import { EvidenceProvider } from '../evidence/evidence';
import { AppIconBadgeProvider } from '../app-icon-badge/app-icon-badge';

@Injectable()
export class NotificationProvider {

  //TODO

  // Implement socket integration
  // Save the notification list in local storage in notification listing page. Manage is_read in front end

  $notificationSubject = new Subject<any>();
  $alertModalSubject = new Subject<any>();
  notificationsData;
  subscription;
  onlineSubscription;
  networkAvailable;
  timeInterval;


  constructor(
    public http: HttpClient, private apiService: ApiProvider,
    private localStorage: LocalStorageProvider,
    private app: App,
    private utils: UtilsProvider,
    private observationProvider: ObservationServiceProvider,
    private ngps: NetworkGpsProvider,
    private evindenceProvider: EvidenceProvider,
    private appBadge: AppIconBadgeProvider,
    private assessmentService: AssessmentServiceProvider) {
    console.log('Hello NotificationProvider Provider');
    //offline event
    this.subscription = this.ngps.networkStatus$.subscribe(success => {
      this.networkAvailable = success;
    })

    // Online event
    // this.onlineSubscription = this.events.subscribe('network:online', () => {
    //   console.log("online")
    //   this.networkAvailable = true;
    // });

    this.networkAvailable = this.ngps.getNetworkStatus();
  }

  startNotificationPooling() {
    this.timeInterval = setInterval(() => {
      if (this.networkAvailable) {
        this.checkForNotificationApi();
      }
      // else {
      //   console.log("no internet");
      // }
      console.log("network = ", this.networkAvailable)
    }, 120000);
    this.checkForNotificationApi();

  }

  checkForInternetConnection() {
    console.log("check for internet")
  }

  checkForNotificationApi() {
    this.apiService.httpGet(AppConfigs.notification.getUnreadNotificationCount, success => {
      this.notificationsData = success.result;
      success.result.count ? this.appBadge.setBadge(success.result.count) : this.appBadge.clearTheBadge();
      // success.result.data = [
      //   {
      //     "is_read": false,
      //     "internal": true,
      //     "payload": {
      //       "appVersion": "1.1.4",
      //       "updateType": "minor/major",
      //       "type": "appUpdate",
      //       "platform": "ios/android"
      //     },
      //     "appName": "samiksha",
      //     "action": "alertModal",
      //     "created_at": "2019-11-25T23:30:02.292Z",
      //     "text": "A new version of this app is available.",
      //     "id": 303,
      //     "type": "Information",
      //     "title": "New update available !"
      //   }
      // ]
      if (success.result.data && success.result.data.length) {
        this.internalNotificationsHandler(success.result.data)
      }
      this.$notificationSubject.next(success.result);
    }, error => {
      this.notificationsData = {};
      this.$notificationSubject.next({});
    },
      { baseUrl: "kendra" })
  }

  internalNotificationsHandler(notifications) {
    console.log("inside internal")
    for (const notification of notifications) {
      if (notification.internal) {
        switch (notification.action) {
          case 'alertModal':
            this.$alertModalSubject.next(notification);
            break
        }
      }
    }
  }




  getAllNotifications(pageCount, limit) {
    return new Promise((resolve, reject) => {
      this.apiService.httpGet(AppConfigs.notification.getAllNotifications + "?page=" + pageCount + '&limit=' + limit, success => {
        resolve(success.result)
      }, error => {
        reject();
      },
        { baseUrl: "kendra" })
    })
  }

  markAsRead(id) {
    return new Promise((resolve, reject) => {
      this.apiService.httpGet(AppConfigs.notification.markAsRead + id, success => {
        resolve(success.result)
      }, error => {
        reject();
      },
        { baseUrl: "kendra" })
    })
  }

  getMappedAssessment(notificationMeta) {
    switch (notificationMeta.payload.type) {
      case 'observation':
        this.getMappedObservation(notificationMeta);
        break

      case 'institutional':
      case 'individual':
        this.getMappedInstitutionalAssessment(notificationMeta);
        break
    }
  }

  goToDetails(notificationMeta) {
    switch (notificationMeta.payload.type) {
      case 'observation':
        // this.getMappedObservation(notificationMeta);
        this.goToAssessmentDetails(notificationMeta);
        break

      case 'institutional':
      case 'individual':
        this.goToAssessmentDetails(notificationMeta);
        break
    }
  }

  openAction(assessment, aseessmemtData, evidenceIndex) {
    this.utils.setCurrentimageFolderName(aseessmemtData.assessment.evidences[evidenceIndex].externalId, assessment._id)
    const options = { _id: assessment._id, name: assessment.name, recentlyUpdatedEntity: assessment.recentlyUpdatedEntity, selectedEvidence: evidenceIndex, entityDetails: aseessmemtData };
    this.evindenceProvider.openActionSheet(options);
  }

  goToAssessmentDetails(notificationMeta) {
    let submissionId = notificationMeta.payload.submission_id;
    let heading = notificationMeta.payload.entity_name;
    this.utils.startLoader();
    this.localStorage.getLocalStorage(this.utils.getAssessmentLocalStorageKey(submissionId)).then(successData => {
      this.utils.stopLoader();
      if (successData.assessment.evidences.length > 1) {
        this.app.getActiveNav().push('EvidenceListPage', { _id: submissionId, name: heading, recentlyUpdatedEntity: {} })
      } else {
        if (successData.assessment.evidences[0].startTime) {
          this.utils.setCurrentimageFolderName(successData.assessment.evidences[0].externalId, submissionId)
          this.app.getActiveNav().push('SectionListPage', { _id: submissionId, name: heading, selectedEvidence: 0, recentlyUpdatedEntity: {} })
        } else {
          const assessment = { _id: submissionId, name: heading, recentlyUpdatedEntity: {} }
          this.openAction(assessment, successData, 0);
        }
      }
    }).catch(error => {
      this.utils.stopLoader();
      // this.utils.openToast("No assessment available.")
      if (notificationMeta.payload.type === 'observation') {
        this.getMappedObservation(notificationMeta);
      } else {
        this.getMappedInstitutionalAssessment(notificationMeta);
      }
    })
  }

  goToObservationDetails(notificationMeta) {

  }

  getMappedInstitutionalAssessment(notificationMeta) {
    this.utils.startLoader();
    this.localStorage.getLocalStorage(notificationMeta.payload.type === 'institutional' ? 'institutionalList' : 'individualList').then(data => {
      this.utils.stopLoader();
      this.assessmentService.refresh(data, notificationMeta.payload.type).then((programsList: Array<any>) => {
        let programIndex = 0;
        for (const program of programsList) {
          if (program._id === notificationMeta.payload.program_id) {
            break
          }
          programIndex++
        }
        if (programIndex < programsList.length) {
          this.app.getRootNav().push(EntityListingPage, { programIndex: programIndex, programs: programsList, assessmentType: notificationMeta.payload.type })
        } else {
          this.utils.openToast("No assessment found");
        }
      }).catch(error => {
        this.utils.stopLoader();
      })
    }).catch(error => {
      this.utils.stopLoader();
    })
  }

  getMappedObservation(notificationMeta) {
    this.utils.startLoader();
    this.localStorage.getLocalStorage('createdObservationList').then(data => {
      this.observationProvider.refreshObservationList(data, event).then((observationList: Array<any>) => {
        let index = 0;
        for (const observation of observationList) {
          if ((observation._id === notificationMeta.payload.observation_id) && (observation.solutionId === notificationMeta.payload.solution_id)) {
            break
          }
          index++
        }
        this.utils.stopLoader();
        if (index < observationList.length) {
          this.app.getRootNav().push(ObservationDetailsPage, { selectedObservationIndex: index });
        } else {
          this.utils.openToast("No observation found");
        }
      }).catch(error => {
        this.utils.stopLoader();
      });
    }).catch(error => {
      this.utils.stopLoader();
    })
  }

  stopNotificationPooling() {
    clearInterval(this.timeInterval);
  }

}
