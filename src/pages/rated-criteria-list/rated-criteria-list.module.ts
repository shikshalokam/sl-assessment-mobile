import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RatedCriteriaListPage } from './rated-criteria-list';
import { TranslateModule } from "@ngx-translate/core";
import { FlaggingModalPage } from '../flagging-modal/flagging-modal';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    RatedCriteriaListPage,
    FlaggingModalPage
  ],
  imports: [
    IonicPageModule.forChild(RatedCriteriaListPage),
    TranslateModule,
    ComponentsModule
  ],
  entryComponents: [FlaggingModalPage]
})
export class RatedCriteriaListPageModule {}
