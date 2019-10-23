import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalController, AlertController } from 'ionic-angular';
import { MatrixActionModalPage } from '../../pages/matrix-action-modal/matrix-action-modal';
import { UtilsProvider } from '../../providers/utils/utils';
import { TranslateService } from '@ngx-translate/core';
import { NetworkGpsProvider } from '../../providers/network-gps/network-gps';

@Component({
  selector: 'matrix-type',
  templateUrl: 'matrix-type.html'
})
export class MatrixTypeComponent implements OnInit {

  @Input() data: any;
  @Input() isLast: boolean;
  @Input() isFirst: boolean;
  @Output() nextCallBack = new EventEmitter();
  @Output() previousCallBack = new EventEmitter();
  @Output() updateLocalData = new EventEmitter();
  @Input() evidenceId: string;
  @Input() schoolId: string;
  @Input() imageLocalCopyId: string;
  @Input() generalQuestion: boolean;
  @Input() submissionId: string;
  @Input() inputIndex;
  @Input() enableGps;
  mainInstance: any;
  initilaData;

  constructor(private modalCntrl: ModalController,
    private translate: TranslateService,
    private ngps: NetworkGpsProvider,
    private utils: UtilsProvider, private alertCtrl: AlertController) {
    console.log('Hello MatrixTypeComponent Component');

  }

  ngOnInit() {
    this.data.startTime = this.data.startTime ? this.data.startTime : Date.now();
    this.initilaData = JSON.parse(JSON.stringify(this.data));
  }

  next(status?: any) {
    this.data.isCompleted = this.utils.isMatrixQuestionComplete(this.data);
    this.nextCallBack.emit(status);
  }

  back() {
    this.data.isCompleted = this.utils.isMatrixQuestionComplete(this.data);
    this.previousCallBack.emit('previous');
  }

  addInstances(): void {
    this.data.value = this.data.value ? this.data.value : [];
    this.data.value.push(JSON.parse(JSON.stringify(this.data.instanceQuestions)));
    this.checkForValidation();
  }

  viewInstance(i): void {
    console.log("open modal");
    const obj = {
      selectedIndex: i,
      data: JSON.parse(JSON.stringify(this.data)),
      evidenceId: this.evidenceId,
      schoolId: this.schoolId,
      generalQuestion: this.generalQuestion,
      submissionId: this.submissionId,
      questionIndex: this.inputIndex
    }
    let matrixModal = this.modalCntrl.create(MatrixActionModalPage, obj);
    matrixModal.onDidDismiss(instanceValue => {
      if (this.enableGps) {
        this.checkForGpsLocation(i, instanceValue)
      } else {
        this.updateInstance(i, instanceValue)
      }
    })
    matrixModal.present();
  }

  checkForGpsLocation(instanceIndex, instanceValue) {
    if (JSON.stringify(instanceValue) !== JSON.stringify(this.data.value[instanceIndex]) && this.checkCompletionOfInstance(instanceValue, null)) {
      this.utils.startLoader();
      this.ngps.getGpsStatus().then(success => {
        this.utils.stopLoader();
        this.updateInstance(instanceIndex, instanceValue, success)
      }).catch(error => {
        this.utils.stopLoader();
        this.utils.openToast("Please try again.");
      })
    } else {
      this.updateInstance(instanceIndex, instanceValue)
    }
  }

  updateInstance(instanceIndex, instanceValue, gpsLocation?: any) {
    if (instanceValue) {
      this.data.completedInstance = this.data.completedInstance ? this.data.completedInstance : [];
      this.data.value[instanceIndex] = instanceValue;
      let instanceCompletion = this.checkCompletionOfInstance(this.data.value[instanceIndex], gpsLocation);
      if (instanceCompletion) {
        if (this.data.completedInstance.indexOf(instanceIndex) < 0) {
          this.data.completedInstance.push(instanceIndex);
        }
      } else {
        const index = this.data.completedInstance.indexOf(instanceIndex);
        if (index >= 0) {
          this.data.completedInstance.splice(index, 1);
        }
      }
      this.checkForValidation();
    }
  }

  checkCompletionOfInstance(data, gpsLocation): boolean {
    let isCompleted = true;
    for (const question of data) {
      // question.isCompleted = this.utils.isQuestionComplete(question);
      question.gpsLocation = gpsLocation ? gpsLocation : "";
      if (!question.isCompleted) {
        isCompleted = false;
        return false
      }
    }
    return isCompleted

  }

  deleteInstance(instanceIndex): void {
    this.data.value.splice(instanceIndex, 1);
    // let instanceCompletion = this.checkCompletionOfInstance(this.data.value[instanceIndex]);
    // if(instanceCompletion) {
    if (this.data.completedInstance && this.data.completedInstance.length && this.data.completedInstance.indexOf(instanceIndex) >= 0) {
      this.data.completedInstance.splice(instanceIndex, 1);
    }
    this.checkForValidation();

    // }
  }

  checkForValidation(): void {
    console.log("innn");
    this.data.isCompleted = this.utils.isMatrixQuestionComplete(this.data);
    this.data.endTime = this.data.isCompleted ? Date.now() : "";
    this.updateLocalData.emit();
  }


  deleteInstanceAlert(index) {
    let translateObject;
    this.translate.get(['actionSheet.confirmDelete', 'actionSheet.confirmDeleteInstance', 'actionSheet.no', 'actionSheet.yes']).subscribe(translations => {
      translateObject = translations;
      console.log(JSON.stringify(translations))
    })
    let alert = this.alertCtrl.create({
      title: translateObject['actionSheet.confirmDelete'],
      message: translateObject['actionSheet.confirmDeleteInstance'],
      buttons: [
        {
          text: translateObject['actionSheet.no'],
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: translateObject['actionSheet.yes'],
          handler: () => {
            this.deleteInstance(index);
          }
        }
      ]
    });
    alert.present();
  }

  getLastModified(instance) {
    let lastModifiedAt = 0;
    for (const question of instance) {
      if (question.startTime > lastModifiedAt) {
        lastModifiedAt = question.startTime;
      }
    }
    return lastModifiedAt
  }
}