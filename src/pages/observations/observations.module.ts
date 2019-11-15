import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ObservationsPage } from './observations';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';
import { AddObservationFormPageModule } from './add-observation-form/add-observation-form.module';
import { ObservationDetailsPage } from '../observation-details/observation-details';

@NgModule({
  declarations: [
    ObservationsPage,
    ObservationDetailsPage
  ],
  imports: [
    TranslateModule,
    ComponentsModule,
    AddObservationFormPageModule,
    IonicPageModule.forChild(ObservationsPage),
  ],
  entryComponents: [
    ObservationDetailsPage
  ]
})
export class ObservationsPageModule { }
