import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyObservationPage } from './my-observation';
import { ComponentsModule } from '../../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { AddObservationFormPageModule } from '../add-observation-form/add-observation-form.module';

@NgModule({
  declarations: [
    MyObservationPage,
  ],
  imports: [
    ComponentsModule,
    AddObservationFormPageModule,
    TranslateModule,
    IonicPageModule.forChild(MyObservationPage),
  ],
})
export class MyObservationPageModule {}
