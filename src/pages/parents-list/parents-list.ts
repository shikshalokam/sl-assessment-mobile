import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ParentsFormPage } from '../parents-form/parents-form';

@IonicPage()
@Component({
  selector: 'page-parents-list',
  templateUrl: 'parents-list.html',
})
export class ParentsListPage {

  parentDetails: any;
  schoolId: string;
  schoolName: string;
  programId: string;
  schoolDetails: any;
  parentInfoList: any;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private modalCntrl: ModalController) {
  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad ParentsListPage');
    this.storage.get('parentRegisterForm').then(form => {
      this.schoolId = this.navParams.get('_id');
      console.log(this.schoolId)
      this.schoolName = this.navParams.get('name');
      this.storage.get('schoolsDetails').then(schoolDetails => {
        if (schoolDetails) {
          this.schoolDetails = JSON.parse(schoolDetails)[this.schoolId];
          // console.log(JSON.stringify(schoolDet[this.schoolId]['schoolProfile']))
          // this.programId = schoolDet[this.schoolId]['program'];

        }
        // this.programId = schoolDet[this.schoolId].program._id;
        // console.log(JSON.stringify(schoolDet[this.schoolId]['program']))
      })
    })

    this.storage.get('ParentInfo').then(success => {
      if(success){
        this.parentInfoList = success;
        console.log(JSON.stringify(this.parentInfoList))

      } else {
        this.parentInfoList = [];
      }
    })

  }

  addParent(): void {
    let parentForm = this.modalCntrl.create(ParentsFormPage);
    parentForm.onDidDismiss(data => {
      if (data) {
        data.programId = this.schoolDetails['program']._id;
        data.schoolId = this.schoolId;
        data.schoolName = this.schoolName;
        this.parentInfoList.push(data)
        this.storage.set('ParentInfo', this.parentInfoList);
      }

    })
    parentForm.present();
  }

}
