import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { HomePage } from '../home/home';
import { SchoolListPage } from '../school-list/school-list';
import { AuthProvider } from '../../providers/auth/auth';
import { CurrentUserProvider } from '../../providers/current-user/current-user';
import { App, NavController } from 'ionic-angular';
import { FaqPage } from '../faq/faq';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab0Root = HomePage;
  tab1Root = SchoolListPage;
  tab2Root = FaqPage;
  tab3Root = AboutPage;

  header: string = 'Schools';

  constructor(private auth: AuthProvider, private navCtrl: NavController,
    private currentUser: CurrentUserProvider, private app: App) {
    this.selectedTab(0);
  }

  selectedTab(index): void {
    switch (index) {
      case 0: default:
        this.header = "Home";
        break;
      case 1:
        this.header = "My Schools";
        break;
      case 2:
        this.header = "FAQs";
        break;
      case 3:
        this.header = "About";
        break;
    }
  }

  logout() {
    this.auth.doLogout().then(response => {
      this.currentUser.removeUser();
      this.app.getRootNav().push('LoginPage')
    })
  }

  goToProfile() {
    this.navCtrl.push('SchoolProfilePage');
  }
}
