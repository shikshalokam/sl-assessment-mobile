import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ParentsListPage } from './parents-list';
import { TranslateModule } from "@ngx-translate/core";
import { ComponentsModule } from '../../components/components.module';
import { ParentsFormPage } from '../parents-form/parents-form';

@NgModule({
  declarations: [
    ParentsListPage,
    ParentsFormPage
  ],
  imports: [
    IonicPageModule.forChild(ParentsListPage),
    TranslateModule,
    ComponentsModule
  ],
  entryComponents: [
    ParentsFormPage
  ]
})
export class ParentsListPageModule {}
