import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { NavController } from "ionic-angular";
import { EntitySolutionsComponent } from "../entity-solutions/entity-solutions";

/**
 * Generated class for the EntityListingV2Component component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: "entity-listing-v2",
  templateUrl: "entity-listing-v2.html",
})
export class EntityListingV2Component {
  @Input() entityList;
  @Input() entityType;
  @Input() showMenu = true;
  // @Output() goToEcmEvent = new EventEmitter();
  @Output() getAssessmentDetailsEvent = new EventEmitter();
  @Output() openMenuEvent = new EventEmitter();
  @Input() enableAddRemoveEntityButton = false;
  @Input() programIndex;
  @Input() programList;
  @Input() assessmentType;
  text: string;

  constructor(public navCtrl: NavController) {
    console.log("Hello EntityListingV2Component Component");
    this.text = "Hello World";
  }

  gotToSoluions(entity, i, j) {
    // console.log(entity);
    this.navCtrl.push(EntitySolutionsComponent, {
      entity: entity,
      i: i,
      j: j,
      programList: this.programList,
      assessmentType: this.assessmentType,
      programIndex: this.programIndex,
      entityList: this.entityList,
    });
  }
}
