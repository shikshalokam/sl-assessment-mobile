import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from '../../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { AddObservationFormPage } from './add-observation-form';
import { IonicStepperModule } from 'ionic-stepper';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EntityListPage } from './entity-list/entity-list';

@NgModule({
  declarations: [
      AddObservationFormPage,
      EntityListPage
  ],
  imports: [
    ComponentsModule,
    TranslateModule,
    IonicStepperModule,
    // BrowserAnimationsModule,
    IonicPageModule.forChild(AddObservationFormPage),
  ],
  entryComponents:[
    EntityListPage
  ]

})
export class AddObservationFormPageModule {}
