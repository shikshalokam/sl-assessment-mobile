import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SchoolProfilePage } from './school-profile';
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
@NgModule({
  declarations: [
    SchoolProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(SchoolProfilePage),
    TranslateModule
  ],
})
export class SchoolProfilePageModule {}
