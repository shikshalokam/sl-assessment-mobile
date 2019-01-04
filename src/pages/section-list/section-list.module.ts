import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SectionListPage } from './section-list';
import { TranslateModule } from "@ngx-translate/core";
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
