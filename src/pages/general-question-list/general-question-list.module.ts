import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GeneralQuestionListPage } from './general-question-list';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    GeneralQuestionListPage,
  ],
  imports: [
    IonicPageModule.forChild(GeneralQuestionListPage),
    ComponentsModule,
    TranslateModule
  ],
})
export class GeneralQuestionListPageModule {}
