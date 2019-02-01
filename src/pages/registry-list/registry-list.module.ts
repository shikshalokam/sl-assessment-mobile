import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ParentsListPage } from './registry-list';
import { TranslateModule } from "@ngx-translate/core";
import { ComponentsModule } from '../../components/components.module';
import { RegistryFormPage } from '../registry-form/registry-form';

@NgModule({
  declarations: [
    ParentsListPage,
    RegistryFormPage
  ],
  imports: [
    IonicPageModule.forChild(ParentsListPage),
    TranslateModule,
    ComponentsModule
  ],
  entryComponents: [
    RegistryFormPage
  ]
})
export class RegistryListPageModule {}
