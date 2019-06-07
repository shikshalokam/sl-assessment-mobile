import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from '../../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { AddObservationFormPage } from './add-observation-form';
import IonicStepperModule from 'ionic-stepper';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
      AddObservationFormPage
  ],
  imports: [
    ComponentsModule,
    TranslateModule,
    IonicStepperModule,
    BrowserAnimationsModule,

    IonicPageModule.forChild(AddObservationFormPage),
  ],
})
export class AddObservationFormPageModule {}
