import { Component, Input } from '@angular/core';
import { NavParams, App, ViewController } from 'ionic-angular';
import { RatingProvider } from '../../providers/rating/rating';

@Component({
  selector: 'menu-item',
  templateUrl: 'menu-item.html'
})
export class MenuItemComponent {

  submissionId: any;
  schoolId: string;
  schoolName: string;
  parent: any;

  constructor(private navParams: NavParams, private ratingService: RatingProvider,
    private appCtrl: App, private viewCtrl: ViewController) {
    console.log('Hello MenuItemComponent Component');
    console.log(this.navParams.get("value"))
    this.submissionId = this.navParams.get('submissionId');
    this.schoolId = this.navParams.get('_id');
    this.schoolName = this.navParams.get('name');
    this.parent = this.navParams.get("parent");
  }

  goToFlaggin(): void {
    const school = {
      _id: this.schoolId,
      name: this.schoolName
    }
    // const submissionId = this.schoolDetails[school._id]['assessments'][0].submissionId;
    this.ratingService.fetchRatedQuestions(this.submissionId, school);
    this.close();
  }

  goToRating(): void {
    const school = {
      _id: this.schoolId,
      name: this.schoolName
    }
    this.ratingService.checkForRatingDetails(this.submissionId, school);
    this.close();
  }

  goToProfile(): void {
    this.appCtrl.getRootNav().push('SchoolProfilePage', {
      _id: this.schoolId,
      name: this.schoolName,
      parent: this.parent
    })
    this.close();
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
