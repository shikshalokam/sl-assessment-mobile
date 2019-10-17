import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController, App } from 'ionic-angular';
import { AssessmentAboutPage } from '../../pages/assessment-about/assessment-about';
import { ObservationEditPage } from '../../pages/observation-edit/observation-edit';
import { ApiProvider } from '../../providers/api/api';
import { AppConfigs } from '../../providers/appConfig';
import { UtilsProvider } from '../../providers/utils/utils';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';

/**
 * Generated class for the GenericMenuPopOverComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'generic-menu-pop-over',
  templateUrl: 'generic-menu-pop-over.html'
})
export class GenericMenuPopOverComponent implements OnInit {

  text: string;
  showAbout = false;
  showEdit = false;
  assessmentIndex;
  assessmentName;
  isObservation;data
  constructor(
    private appCtrl: App,
    private navParams: NavParams,
    private viewCntrl: ViewController,
    private apiProvider: ApiProvider,
    private utils: UtilsProvider,
    private localStorage: LocalStorageProvider
  ) {
    console.log('Hello GenericMenuPopOverComponent Component');
    this.text = 'Hello World';
    this.showAbout = this.navParams.get('showAbout')
    this.showEdit = this.navParams.get('showEdit')
    this.assessmentIndex = this.navParams.get('assessmentIndex')
    this.assessmentName = this.navParams.get('assessmentName');
    this.isObservation = this.navParams.get('isObservation');
  }

  ngOnInit() {
    this.localStorage.getLocalStorage(this.assessmentName).then(success => {
      this.data = success[this.assessmentIndex];
      // this.formFields[0].value = this.data.name;
      // this.formFields[1].value = this.data.description;
      // this.formGroup = this.utils.createFormGroup(this.formFields)
      console.log(JSON.stringify(success[this.assessmentIndex]))
    }).catch(error => {

    });
  }
  goToAbout() {
    this.appCtrl.getRootNav().push(AssessmentAboutPage, { assessmentIndex: this.assessmentIndex, assessmentName: this.assessmentName, isObservation: this.isObservation })
    this.viewCntrl.dismiss();

  }
  goToEdit() {
    this.appCtrl.getRootNav().push(ObservationEditPage, { assessmentIndex: this.assessmentIndex, assessmentName: this.assessmentName })
    this.viewCntrl.dismiss();
  }

  deleteObservation() {
    this.utils.startLoader();
    const payload = {

    }
    this.apiProvider.httpPost(AppConfigs.cro.observationDelete+ this.data._id, {}, success => {
      console.log(JSON.stringify(success))
      this.utils.openToast(success.message);
    this.viewCntrl.dismiss();

      this.utils.stopLoader();
    }, error => {
      this.utils.stopLoader();

    })
  }
}
