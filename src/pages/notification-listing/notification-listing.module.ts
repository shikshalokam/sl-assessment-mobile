import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationListingPage } from './notification-listing';
import { TranslateModule } from "@ngx-translate/core";
import { ComponentsModule } from '../../components/components.module';
@NgModule({
  declarations: [
    NotificationListingPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificationListingPage),
    TranslateModule,
    ComponentsModule
  ],
})
export class NotificationListingPageModule { }
