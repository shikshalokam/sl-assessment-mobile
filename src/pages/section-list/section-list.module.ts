import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SectionListPage } from './section-list';
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

@NgModule({
  declarations: [
    SectionListPage,
  ],
  imports: [
    IonicPageModule.forChild(SectionListPage),
    TranslateModule
  ],
})
export class SectionListPageModule {}
