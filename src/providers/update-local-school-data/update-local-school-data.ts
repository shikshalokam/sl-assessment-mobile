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
    console.log('Hello UpdateLocalSchoolDataProvider Provider');
  }

  getSubmissionStatus(): void {
    console.log(this.currentSchool.assessments[0].submissionId)
    const url = AppConfigs.survey.getSubmissionStatus + this.currentSchool.assessments[0].submissionId;
    // console.log(url)
    this.apiService.httpGet(url, success => {
      // console.log(JSON.stringify(success))
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
        console.log("Else if")
        this.utils.startLoader();
        this.getSubmissionStatus();
      }
    })
  }

  updateSubmissionsOnLogin(schoolId) {
    for (const evidence of this.schoolDetails[schoolId].assessments[0].evidences) {
      const validSubmission = this.updatedSubmissionStatus[evidence.externalId];
      if (validSubmission) {
        for (const section of evidence.sections) {
          for (const question of section.questions) {
            // console.log(question._id)
            if(validSubmission.answers && validSubmission.answers[question._id]) {
              question.value = question.responseType !== 'matrix' ? validSubmission.answers[question._id].value : this.constructMatrixValue(validSubmission, question, evidence.externalId);
              question.remarks = validSubmission.answers[question._id].remarks;
            }
          }
        }
      }

    }
    // console.log(JSON.stringify(this.currentSchool))
    this.storage.set('schoolsDetails', JSON.stringify(this.schoolDetails));
    this.events.publish("localDataUpdated");

  }

  checkForLocalDataUpdate(): void {
    for (const evidence of this.currentSchool.assessments[0].evidences) {
      // console.log("evidence")
      //Updates the local data only if the present user didnot start the ECM
      // if(!evidence.startTime) {
      // console.log(this.currentUser.getCurrentUserData().sub)
      const validSubmission = this.getValidSubmissionForEvidenceMethod(evidence.externalId);
      evidence.isSubmitted = validSubmission.submittedBy ? true : false;
      evidence.startTime = validSubmission.startTime;
      evidence.endTime = validSubmission.endTime;
      // console.log(evidence.startTime)
      // console.log(JSON.stringify(validSubmission))
      // console.log(evidence.startTime + "Start time")
      // console.log(validSubmission.submittedBy !== this.currentUser.getCurrentUserData().sub + " " + validSubmission.submissions)
      if ((validSubmission && (validSubmission.submittedBy !== this.currentUser.getCurrentUserData().sub) && !evidence.startTime) || (validSubmission && (validSubmission.submittedBy === this.currentUser.getCurrentUserData().sub))) {
        console.log("innnnnnn")
        for (const section of evidence.sections) {
          // console.log(section.responseType)

          for (const question of section.questions) {
            console.log(question.responseType)
            // console.log(JSON.stringify(validSubmission))
            // if(question.responseType !== 'matrix') {

            // }
            question.value = question.responseType !== 'matrix' ? validSubmission.answers[question._id].value : this.constructMatrixValue(validSubmission, question, evidence.externalId);
            question.remarks = validSubmission.answers[question._id].remarks;
            // question.fileName = validSubmission.answers[question._id].fileName
          }
        }
      }
      // console.log(JSON.stringify(validSubmission))

      // }

    }
    // console.log(JSON.stringify(this.currentSchool.assessments[0].evidences))
    this.storage.set('schoolsDetails', JSON.stringify(this.schoolDetails));
    this.events.publish("localDataUpdated");
  }


  constructMatrixValue(validSubmission, matrixQuestion, ecmId) {
    // console.log("Valid Submission " + JSON.stringify(validSubmission))
    // console.log("Matrix Question" + JSON.stringify(matrixQuestion));
    // console.log(matrixQuestion._id)
    // console.log(ecmId);
    matrixQuestion.value = [];
    // console.log(validSubmission.answers[matrixQuestion._id].value)
    if (validSubmission.answers && validSubmission.answers[matrixQuestion._id] && validSubmission.answers[matrixQuestion._id].value) {
      for (const answer of validSubmission.answers[matrixQuestion._id].value) {
        matrixQuestion.value.push(JSON.parse(JSON.stringify(matrixQuestion.instanceQuestions)));
      }
      // console.log("Matrix Question" + JSON.stringify(matrixQuestion.value));

      // for (const instance of matrixQuestion.value) {
      //   for (const question of instance) {
      //     console.log(validSubmission.answers[matrixQuestion._id].value[question._id])
      //     // question.value = validSubmission.answers[matrixQuestion._id].value[question._id].value;
      //   }
      // }

      matrixQuestion.value.forEach((instance, index) => {
        instance.forEach(question => {
          question.value = validSubmission.answers[matrixQuestion._id].value[index][question._id].value;
          question.remarks = validSubmission.answers[matrixQuestion._id].value[index][question._id].remarks;
        });
      });
      return matrixQuestion.value
      // console.log(JSON.stringify(matrixQuestion.value))
    } else {
      return []
    }
  }

  getValidSubmissionForEvidenceMethod(ECMexternalId): any {
    // console.log(JSON.stringify(this.updatedSubmissionStatus[ECMexternalId]));
    // console.log(this.updatedSubmissionStatus[ECMexternalId].submissions.length)
    if (this.updatedSubmissionStatus[ECMexternalId].isSubmitted) {
      for (const submission of this.updatedSubmissionStatus[ECMexternalId].submissions) {
        // console.log("Submission")
        if (submission.isValid) {
          console.log("valid submissions");
          return submission
        }
      }
      return {}
    } else {
      return ""

    }

  }

}
