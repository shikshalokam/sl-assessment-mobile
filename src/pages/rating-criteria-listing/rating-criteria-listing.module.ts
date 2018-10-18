import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RatingCriteriaListingPage } from './rating-criteria-listing';
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
@NgModule({
  declarations: [
    RatingCriteriaListingPage,
  ],
  imports: [
    IonicPageModule.forChild(RatingCriteriaListingPage),
    TranslateModule
  ],
})
export class RatingCriteriaListingPageModule {}
