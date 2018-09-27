import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuestionerPage } from './questioner';
import { ComponentsModule } from '../../components/components.module';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  declarations: [
    QuestionerPage,
  ],
  imports: [
    IonicPageModule.forChild(QuestionerPage),
    ComponentsModule,
    DirectivesModule
  ],
})
export class QuestionerPageModule {}
