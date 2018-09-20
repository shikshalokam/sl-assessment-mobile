import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { SchoolListPage } from '../school-list/school-list';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = SchoolListPage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;

  header: string = 'Schools';

  constructor() {

  }

  selectedTab(index): void {
    switch (index) {
      case 1:
        this.header = "About";
        break;
      case 2:
        this.header = "My Schools";
        break;
      case 3:
        this.header = "FAQs";
        break;
    }
  }
}
