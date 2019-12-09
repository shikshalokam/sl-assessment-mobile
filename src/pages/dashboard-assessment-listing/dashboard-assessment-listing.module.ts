import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DashboardAssessmentListingPage } from './dashboard-assessment-listing';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    DashboardAssessmentListingPage,
  ],
  imports: [
    IonicPageModule.forChild(DashboardAssessmentListingPage),
    TranslateModule,
    ComponentsModule
  ],
})
export class DashboardAssessmentListingPageModule {}
