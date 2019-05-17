import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EntityProfilePage } from './entity-profile';
import { TranslateModule } from "@ngx-translate/core";
import { ComponentsModule } from '../../components/components.module';
EntityProfilePage
@NgModule({
  declarations: [
    EntityProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(EntityProfilePage),
    TranslateModule,
    ComponentsModule
  ],
})
export class EntityProfilePageModule {}
