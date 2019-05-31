import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DraftObservationPage } from './draft-observation';
import { ComponentsModule } from '../../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    DraftObservationPage,
  ],
  imports: [
    ComponentsModule,
    TranslateModule,
    IonicPageModule.forChild(DraftObservationPage),
  ],
})
export class DraftObservationPageModule {}
