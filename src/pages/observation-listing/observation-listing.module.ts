import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ObservationListingPage } from './observation-listing';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';
@NgModule({
  declarations: [
    ObservationListingPage,
  ],
  imports: [
    IonicPageModule.forChild(ObservationListingPage),
    TranslateModule,
    ComponentsModule
  ],
})
export class ObservationListingPageModule {}
