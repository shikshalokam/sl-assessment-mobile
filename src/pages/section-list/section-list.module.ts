import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SectionListPage } from './section-list';
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    SectionListPage,
  ],
  imports: [
    IonicPageModule.forChild(SectionListPage),
    TranslateModule,
    ComponentsModule
  ],
})
export class SectionListPageModule {}
