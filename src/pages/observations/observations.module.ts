import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ObservationsPage } from './observations';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';
import { MyObservationPageModule } from './my-observation/my-observation.module';
import { ViewObservationPageModule } from './view-observation/view-observation.module';

@NgModule({
  declarations: [
    ObservationsPage,
    
  ],
  imports: [
    TranslateModule,
    ComponentsModule,
    MyObservationPageModule,
    ViewObservationPageModule,
    IonicPageModule.forChild(ObservationsPage),
  ],
})
export class ObservationsPageModule {}
