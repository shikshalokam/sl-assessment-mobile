import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SchoolProfilePage } from './school-profile';
import { TranslateModule } from "@ngx-translate/core";
import { ComponentsModule } from '../../components/components.module';
@NgModule({
  declarations: [
    SchoolProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(SchoolProfilePage),
    TranslateModule,
    ComponentsModule
  ],
})
export class SchoolProfilePageModule {}
