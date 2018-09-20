import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SchoolProfilePage } from './school-profile';

@NgModule({
  declarations: [
    SchoolProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(SchoolProfilePage),
  ],
})
export class SchoolProfilePageModule {}
