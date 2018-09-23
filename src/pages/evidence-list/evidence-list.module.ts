import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EvidenceListPage } from './evidence-list';

@NgModule({
  declarations: [
    EvidenceListPage,
  ],
  imports: [
    IonicPageModule.forChild(EvidenceListPage),
  ],
})
export class EvidenceListPageModule {}
