import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EvidenceListPage } from './evidence-list';
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

@NgModule({
  declarations: [
    EvidenceListPage,
  ],
  imports: [
    IonicPageModule.forChild(EvidenceListPage),
    TranslateModule
  ],
})
export class EvidenceListPageModule {}
