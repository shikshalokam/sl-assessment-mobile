import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SectionListPage } from './section-list';

@NgModule({
  declarations: [
    SectionListPage,
  ],
  imports: [
    IonicPageModule.forChild(SectionListPage),
  ],
})
export class SectionListPageModule {}
