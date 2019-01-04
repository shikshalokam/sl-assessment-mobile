import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuestionerPage } from './questioner';
import { ComponentsModule } from '../../components/components.module';
import { DirectivesModule } from '../../directives/directives.module';
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations: [
    QuestionerPage,
  ],
  imports: [
    IonicPageModule.forChild(QuestionerPage),
    ComponentsModule,
    TranslateModule,
    DirectivesModule
  ],
})
export class QuestionerPageModule {}
