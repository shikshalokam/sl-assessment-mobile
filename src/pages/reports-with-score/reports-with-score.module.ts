import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportsWithScorePage } from './reports-with-score';

@NgModule({
  declarations: [
    ReportsWithScorePage,
  ],
  imports: [
    IonicPageModule.forChild(ReportsWithScorePage),
  ],
})
export class ReportsWithScorePageModule {}
