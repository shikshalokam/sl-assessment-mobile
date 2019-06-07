import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewObservationPage } from './view-observation';
import { ComponentsModule } from '../../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ViewObservationPage,
  ],
  imports: [
    ComponentsModule,
    TranslateModule,
    IonicPageModule.forChild(ViewObservationPage),
  ],
})
export class ViewObservationPageModule {}
