import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegistryListPage } from './registry-list';
import { TranslateModule } from "@ngx-translate/core";
import { ComponentsModule } from '../../components/components.module';
import { RegistryFormPage } from '../registry-form/registry-form';

@NgModule({
  declarations: [
    RegistryListPage,
    RegistryFormPage
  ],
  imports: [
    IonicPageModule.forChild(RegistryListPage),
    TranslateModule,
    ComponentsModule
  ],
  entryComponents: [
    RegistryFormPage
  ]
})
export class RegistryListPageModule {}
