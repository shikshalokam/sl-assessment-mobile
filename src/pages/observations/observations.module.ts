import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ObservationsPage } from './observations';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ObservationsPage,
  ],
  imports: [
    TranslateModule,
    ComponentsModule,
    IonicPageModule.forChild(ObservationsPage),
  ],
})
export class ObservationsPageModule {}
