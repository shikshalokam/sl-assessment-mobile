import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuestionerPage } from './questioner';
import { ComponentsModule } from '../../components/components.module';
import { DirectivesModule } from '../../directives/directives.module';
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
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
