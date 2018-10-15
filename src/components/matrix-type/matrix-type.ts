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
  }
  next(status?: any) {
    console.log(JSON.stringify(this.data));
    this.data.isCompleted = (this.data.value && this.data.value.length) ? true : false;
    this.nextCallBack.emit(status);
  }

  back() {
    this.data.isCompleted = (this.data.value && this.data.value.length) ? true : false;
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
        this.data.value[i] = data.value[i];
      }
    })
    matrixModal.present();
  }

  deleteInstance(instanceIndex): void {
    this.data.value.splice(instanceIndex, 1)
  }
}
