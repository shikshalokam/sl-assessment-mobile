import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddObservationPage } from './add-observation';
import { ComponentsModule } from '../../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AddObservationPage,
  ],
  imports: [
    ComponentsModule,
    TranslateModule,
    IonicPageModule.forChild(AddObservationPage),
  ],
})
export class AddObservationPageModule {}
