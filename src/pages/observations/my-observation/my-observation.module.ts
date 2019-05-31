import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyObservationPage } from './my-observation';
import { ComponentsModule } from '../../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    MyObservationPage,
  ],
  imports: [
    ComponentsModule,
    TranslateModule,
    IonicPageModule.forChild(MyObservationPage),
  ],
})
export class MyObservationPageModule {}
