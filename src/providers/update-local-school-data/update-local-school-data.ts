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
    const url = AppConfigs.survey.getSubmissionStatus + this.currentSchool.assessments[0].submissionId;
    console.log(url)
    this.apiService.httpGet(url, success => {
      console.log(JSON.stringify(success))
      this.updatedSubmissionStatus = success.result.evidences;
      this.utils.stopLoader();
      this.checkForLocalDataUpdate();
    }, error => {
      this.utils.stopLoader();

    })
  }

  getLocalData(obj, submissionStatus?: any): void {
    this.utils.startLoader();
    this.storage.get('schoolsDetails').then(details => {
      this.schoolDetails = JSON.parse(details);
      this.currentSchool = this.schoolDetails[obj._id];
      // console.log(this.currentSchool.assessments[0].submissionId)
      if(submissionStatus) {

      } else {
        this.getSubmissionStatus();
      }
    })
  }

  checkForLocalDataUpdate(): void {
    for (const evidence of this.currentSchool.assessments[0].evidences) {
      console.log("evidence")
      //Updates the local data only if the present user didnot start the ECM
      // if(!evidence.startTime) {
        // console.log(this.currentUser.getCurrentUserData().sub)
        const validSubmission = this.getValidSubmissionForEvidenceMethod(evidence.externalId);
        // console.log(evidence.startTime)
        console.log(JSON.stringify(validSubmission))
      console.log(evidence.startTime + "Start time")
        // console.log(validSubmission.submittedBy !== this.currentUser.getCurrentUserData().sub + " " + validSubmission.submissions)
        if(validSubmission && (validSubmission.submittedBy !== this.currentUser.getCurrentUserData().sub) && evidence.startTime ) {
          console.log("innnnnnn")
          for (const section of evidence.sections) {
            // console.log(section.responseType)

            for (const question of section.questions) {
              console.log(question.responseType)

              // if(question.responseType !== 'matrix') {
                
              // }
              question.value = question.responseType !== 'matrix' ? validSubmission.answers[question._id].value : this.constructMatrixValue(validSubmission,question, evidence.externalId);
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
    if(validSubmission.answers[matrixQuestion._id].value) {
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

      matrixQuestion.value.forEach((instance,index) => {
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

  getValidSubmissionForEvidenceMethod(ECMexternalId): any{
    // console.log(JSON.stringify(this.updatedSubmissionStatus[ECMexternalId]));
    // console.log(this.updatedSubmissionStatus[ECMexternalId].submissions.length)
    if(this.updatedSubmissionStatus[ECMexternalId].isSubmitted) {
      for (const submission of this.updatedSubmissionStatus[ECMexternalId].submissions) {
        // console.log("Submission")
        if(submission.isValid) {
          // console.log(JSON.stringify(submission))
          return submission
        }
      } 
      return {}
    } else {
      return {} 

    }

  }

}
