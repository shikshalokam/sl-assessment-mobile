import { Component, ViewChild } from "@angular/core";
import { HomePage } from "../../pages/home/home";
import { InstitutionPage } from "../../pages/institution/institution";
import { NavController } from "ionic-angular";
// import { Nav } from "ionic-angular";

/**
 * Generated class for the BottomNavComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: "bottom-nav",
  templateUrl: "bottom-nav.html",
})
export class BottomNavComponent {
  text: string;
  bottomMenu = [
    {
      name: "home",
      component: HomePage,
      icon: "home",
    },
    {
      name: "institution",
      component: InstitutionPage,
      icon: "school",
    },
    {
      name: "library",
      component: InstitutionPage,
      icon: "book",
    },
    {
      name: "report",
      component: InstitutionPage,
      icon: "list-box",
    },
  ];
  selectedBottomMenu: string;

  constructor(public nav: NavController) {
    console.log("Hello BottomNavComponent Component");
    this.text = "Hello World";
  }

  goToBottomMenu(selectedMenuIndex) {
    this.selectedBottomMenu = this.bottomMenu[selectedMenuIndex].name;
    this.nav.push(this.bottomMenu[selectedMenuIndex].component);
  }
}
