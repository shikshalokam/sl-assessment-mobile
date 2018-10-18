import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  languageChange: string = 'en';
  constructor(public navCtrl: NavController, private translate: TranslateService) {

  }

  changeLanguage(val): void {
    this.translate.use(this.languageChange)
    // console.log("val")
  }

}
