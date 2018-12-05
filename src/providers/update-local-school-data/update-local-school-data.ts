import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiProvider } from '../api/api';
import { AppConfigs } from '../appConfig';
import { Storage } from '@ionic/storage';
import { UtilsProvider } from '../utils/utils';
import { CurrentUserProvider } from '../current-user/current-user';
import { Events } from 'ionic-angular';

@Injectable()
export class UpdateLocalSchoolDataProvider {
  schoolDetails: any;
  currentSchool: any;
  updatedSubmissionStatus: any;

  constructor(public http: HttpClient, private apiService: ApiProvider, private storage: Storage,
    private utils: UtilsProvider, private currentUser: CurrentUserProvider, private events: Events) {
  }

  getSubmissionStatus(): void {
    const url = AppConfigs.survey.getSubmissionStatus + this.currentSchool.assessments[0].submissionId;
    this.apiService.httpGet(url, success => {
      this.updatedSubmissionStatus = success.result.evidences;
      this.utils.stopLoader();
      this.checkForLocalDataUpdate();
    }, error => {
      this.utils.stopLoader();

    })
  }

  getLocalData(obj, submissionStatus?: any): void {
    this.storage.get('schoolsDetails').then(details => {
      this.schoolDetails = JSON.parse(details);
      this.currentSchool = this.schoolDetails[obj._id];
      if (submissionStatus) {
        this.updatedSubmissionStatus = submissionStatus;
        this.updateSubmissionsOnLogin(obj._id);
      } else {
        this.utils.startLoader();
        this.getSubmissionStatus();
      }
    })
  }

  mapSubmissionDataToQuestion(allSchoolDetails): void {
    const schoolObj = {}
    for (const schoolId of Object.keys(allSchoolDetails)) {
      const mappedData = this.updateSubmissionsOnLogin(allSchoolDetails[schoolId]);
      schoolObj[mappedData["schoolProfile"]["_id"]] = mappedData;

    }
    this.storage.set('schoolsDetails', JSON.stringify(schoolObj));
    this.events.publish("localDataUpdated");
  }
  updateSubmissionsOnLogin(schoolData) {
    for (const evidence of schoolData.assessments[0].evidences) {
      const validSubmission = schoolData.assessments[0].submissions[evidence.externalId];
      if (validSubmission) {
        for (const section of evidence.sections) {
          for (const question of section.questions) {
            // // console.logg(question._id)
            if (validSubmission.answers && validSubmission.answers[question._id]) {
              question.value = question.responseType !== 'matrix' ? validSubmission.answers[question._id].value : this.constructMatrixValue(validSubmission, question, evidence.externalId);
              question.remarks = validSubmission.answers[question._id].remarks;
            }
          }
        }
      }

    }
    return schoolData
  }

  checkForLocalDataUpdate(): void {
    for (const evidence of this.currentSchool.assessments[0].evidences) {
      const validSubmission = this.getValidSubmissionForEvidenceMethod(evidence.externalId);
      evidence.isSubmitted = validSubmission.submittedBy ? true : false;
      evidence.startTime = validSubmission.startTime;
      evidence.endTime = validSubmission.endTime;
      if ((validSubmission && (validSubmission.submittedBy !== this.currentUser.getCurrentUserData().sub) && !evidence.startTime) || (validSubmission && (validSubmission.submittedBy === this.currentUser.getCurrentUserData().sub))) {
        for (const section of evidence.sections) {
          for (const question of section.questions) {
            question.value = question.responseType !== 'matrix' ? validSubmission.answers[question._id].value : this.constructMatrixValue(validSubmission, question, evidence.externalId);
            question.remarks = validSubmission.answers[question._id].remarks;
          }
        }
      }
    }
    this.storage.set('schoolsDetails', JSON.stringify(this.schoolDetails));
    this.events.publish("localDataUpdated");
  }


  constructMatrixValue(validSubmission, matrixQuestion, ecmId) {
    matrixQuestion.value = [];
    if (validSubmission.answers && validSubmission.answers[matrixQuestion._id] && validSubmission.answers[matrixQuestion._id].value) {
      for (const answer of validSubmission.answers[matrixQuestion._id].value) {
        matrixQuestion.value.push(JSON.parse(JSON.stringify(matrixQuestion.instanceQuestions)));
      }
      matrixQuestion.value.forEach((instance, index) => {
        instance.forEach(question => {
          if(validSubmission.answers[matrixQuestion._id] && validSubmission.answers[matrixQuestion._id].value[index][question._id]) {
            question.value = validSubmission.answers[matrixQuestion._id].value[index][question._id].value;
            question.remarks = validSubmission.answers[matrixQuestion._id].value[index][question._id].remarks;
          }
        });
      });
      return matrixQuestion.value
    } else {
      return []
    }
  }

  getValidSubmissionForEvidenceMethod(ECMexternalId): any {
    if (this.updatedSubmissionStatus[ECMexternalId].isSubmitted) {
      for (const submission of this.updatedSubmissionStatus[ECMexternalId].submissions) {
        if (submission.isValid) {
          return submission
        }
      }
      return {}
    } else {
      return ""

    }

  }

}
