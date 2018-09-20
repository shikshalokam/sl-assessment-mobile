import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { SchoolListPage } from '../school-list/school-list';
import { AuthProvider } from '../../providers/auth/auth';
import { CurrentUserProvider } from '../../providers/current-user/current-user';
import { App , NavController} from 'ionic-angular';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = SchoolListPage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;

  header: string = 'Schools';

  constructor(private auth: AuthProvider, private navCtrl: NavController,
    private currentUser: CurrentUserProvider, private app: App) {

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
