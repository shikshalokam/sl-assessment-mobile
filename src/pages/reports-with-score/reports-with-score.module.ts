import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportsWithScorePage } from './reports-with-score';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ReportsWithScorePage,
  ],
  imports: [
    IonicPageModule.forChild(ReportsWithScorePage),
    TranslateModule,
    ComponentsModule
  ],
})
export class ReportsWithScorePageModule {}
