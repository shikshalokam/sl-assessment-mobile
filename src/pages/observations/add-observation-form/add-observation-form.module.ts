import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from '../../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { AddObservationFormPage } from './add-observation-form';
import { IonicStepperModule } from 'ionic-stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SchoolListPage } from './school-list/school-list';

@NgModule({
  declarations: [
      AddObservationFormPage,
      SchoolListPage
  ],
  imports: [
    ComponentsModule,
    TranslateModule,
    IonicStepperModule,
    BrowserAnimationsModule,
    IonicPageModule.forChild(AddObservationFormPage),
  ],
  entryComponents:[
    SchoolListPage
  ]

})
export class AddObservationFormPageModule {}
