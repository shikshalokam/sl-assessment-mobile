import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { AppConfigs } from '../../providers/appConfig';
import { AssessmentServiceProvider } from '../../providers/assessment-service/assessment-service';

@Component({
  selector: 'institutions-entity-list',
  templateUrl: 'institutions-entity-list.html',
})
export class InstitutionsEntityList {

  assessmentlocalStorageName = 'institutionalList';
  programs: any;
  enableRefresh = AppConfigs.configuration.enableAssessmentListRefresh;
  entityprofileId: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private localStorage: LocalStorageProvider,
    private assessmentService: AssessmentServiceProvider,
  ) {
  }

  ionViewDidLoad() {
    this.localStorage.getLocalStorage('institutionalList').then(data => {
      if (data) {
        this.programs = data;
      } else {
        this.getAssessmentsApi();
      }
    }).catch(error => {
      this.getAssessmentsApi();
    })
  }

  ionViewWillEnter() {
  }

  getAssessmentsApi() {
    this.assessmentService.getAssessmentsApi('institutional').then(programs => {
      this.programs = programs;
    }).catch(error => {
    })
  }

  refresh(event?: any) {
    event ? this.assessmentService.refresh(this.programs, 'institutional', event).then(program => {
      this.programs = program;
      console.log(JSON.stringify(program))
    }).catch(error => { })
      :
      this.assessmentService.refresh(this.programs, 'institutional').then(program => {
        this.programs = program;
        console.log(JSON.stringify(program))
      }
      ).catch(error => {
      });
  }

  openMenu(event) {
    this.assessmentService.openMenu(event, this.programs, true);
  }

}
