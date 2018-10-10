import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatrixModalComponent } from '../matrix-modal/matrix-modal';
import { ModalController, NavParams } from 'ionic-angular';
import { MatrixActionModalPage } from '../../pages/matrix-action-modal/matrix-action-modal';

@Component({
  selector: 'matrix-type',
  templateUrl: 'matrix-type.html'
})
export class MatrixTypeComponent {

  @Input() data: any;
  @Input() isLast: boolean;
  @Input() isFirst: boolean;
  @Output() nextCallBack = new EventEmitter();
  @Output() previousCallBack = new EventEmitter()
  @Input() evidenceId: string;
  mainInstance: any;
  constructor(private modalCntrl: ModalController) {
    console.log('Hello MatrixTypeComponent Component');
    // this.text = 'Hello World';
  }
  next(status?: any) {
    this.data.isCompleted = (this.data.value && this.data.value.length) ? true : false;
    this.nextCallBack.emit(status);
  }

  back() {
    this.data.isCompleted = (this.data.value && this.data.value.length) ? true : false;
    this.previousCallBack.emit('previous');
  }
  addInstances():void {
    this.data.value = this.data.value ? this.data.value : [];
    // this.mainInstance = this.mainInstance ? this.mainInstance: Object.assign([], this.data.instanceQuestions);
    console.log(JSON.stringify(this.data.instanceQuestions));
    // console.log(JSON.stringify(this.mainInstance))
    this.data.value.push( JSON.parse(JSON.stringify(this.data.instanceQuestions)));
  }

  viewInstance(i): void {
    console.log("open modal");
    const obj = {
      selectedIndex :i,
      data: this.data 
    }
    let matrixModal = this.modalCntrl.create(MatrixActionModalPage, obj);
    matrixModal.onDidDismiss(data => {
      this.data.value[i] = data.value[i];
      console.log(JSON.stringify(data));
    })
    matrixModal.present();
  }

  resetValaues(questions) {
    for (const question of questions) {
      question.value = ""
    }
    console.log(questions);
    return questions
  }

}
