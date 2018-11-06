import { Component, Input } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { RemarksPage } from '../../pages/remarks/remarks';


@Component({
  selector: 'remarks',
  templateUrl: 'remarks.html'
})
export class RemarksComponent {

  @Input() data: any;

  constructor(private modalCtrl: ModalController) {
    console.log('Hello RemarksComponent Component');
  }

  openUpdateRemarks(): void {
    const remarks = this.modalCtrl.create(RemarksPage, {data: JSON.parse(JSON.stringify(this.data))});
    remarks.onDidDismiss( updatedRemark => {
      if(updatedRemark){
        this.data.remarks = updatedRemark;
      }
    })
    remarks.present();
  }

}
