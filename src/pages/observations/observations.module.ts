import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ObservationsPage } from './observations';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';
import { DraftObservationPageModule } from './draft-observation/draft-observation.module';
import { AddObservationPageModule } from './add-observation/add-observation.module';
import { MyObservationPageModule } from './my-observation/my-observation.module';

@NgModule({
  declarations: [
    ObservationsPage,
    
  ],
  imports: [
    TranslateModule,
    ComponentsModule,
    DraftObservationPageModule,
    AddObservationPageModule,
    MyObservationPageModule,
    IonicPageModule.forChild(ObservationsPage),
  ],
})
export class ObservationsPageModule {}
