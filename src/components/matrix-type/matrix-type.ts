import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatrixModalComponent } from '../matrix-modal/matrix-modal';
import { ModalController, NavParams } from 'ionic-angular';
import { MatrixActionModalPage } from '../../pages/matrix-action-modal/matrix-action-modal';
import { UtilsProvider } from '../../providers/utils/utils';
import { QuestionDashboardPage } from '../../pages/question-dashboard/question-dashboard';

@Component({
  selector: 'matrix-type',
  templateUrl: 'matrix-type.html'
})
export class MatrixTypeComponent {

  @Input() data: any;
  @Input() isLast: boolean;
  @Input() isFirst: boolean;
  @Output() nextCallBack = new EventEmitter();
  @Output() previousCallBack = new EventEmitter();
  @Output() updateLocalData = new EventEmitter();
  @Input() evidenceId: string;
  @Input() schoolId: string;
  
  mainInstance: any;

  constructor(private modalCntrl: ModalController, private utils: UtilsProvider) {
    console.log('Hello MatrixTypeComponent Component');
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
  }

  viewInstance(i): void {
    console.log("open modal");
    const obj = {
      selectedIndex: i,
      data: this.data
    }
    let matrixModal = this.modalCntrl.create(MatrixActionModalPage, obj);
    matrixModal.onDidDismiss(data => {
      if (data) {
        this.data.completedInstance =  this.data.completedInstance ? this.data.completedInstance : [];
        this.data.value[i] = data.value[i];
        console.log(JSON.stringify(this.data.value[i]));
        let instanceCompletion = this.checkCompletionOfInstance(this.data.value[i]);
        if(instanceCompletion) {
          if(this.data.completedInstance.indexOf(i) < 0) {
            this.data.completedInstance.push(i);
          }
        } else {
          const index = this.data.completedInstance.indexOf(i);
          if(index >= 0) {
            this.data.completedInstance.splice(index, 1);
          }
        }
        this.updateLocalData.emit();
      }
    })
    matrixModal.present();
  }

  checkCompletionOfInstance(data): boolean{
    let isCompleted = true;
    for (const question of data) {
      if(!question.isCompleted){
        isCompleted = false
      }
    }
    return isCompleted

  }

  deleteInstance(instanceIndex): void {
    this.data.value.splice(instanceIndex, 1)
  }
}
