import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EvidenceListPage } from './evidence-list';
import { TranslateModule } from "@ngx-translate/core";
import { ComponentsModule } from '../../components/components.module';


@NgModule({
  declarations: [
    EvidenceListPage,
  ],
  imports: [
    IonicPageModule.forChild(EvidenceListPage),
    TranslateModule,
    ComponentsModule
  ],
})
export class EvidenceListPageModule {}
