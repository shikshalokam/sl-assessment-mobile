import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * Generated class for the EntityListingComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'entity-listing',
  templateUrl: 'entity-listing.html'
})
export class EntityListingComponent {

  @Input() heading;
  @Input() entityList;
  @Input() entityType;
  @Input() showMenu = true;
  @Output() goToEcmEvent = new EventEmitter();
  @Output() getAssessmentDetailsEvent = new EventEmitter();
  @Output() openMenuEvent = new EventEmitter();

  text: string;

  constructor() {
    console.log('Hello EntityListingComponent Component');
    this.text = 'Hello World';
  }

  goToEcm(id, name) {
    console.log(JSON.stringify(id))
    this.goToEcmEvent.emit({
      submissionId: id,
      name: name
    })
  }
  getAssessmentDetails(programIndex, assessmentIndex, entityIndex) {
    this.getAssessmentDetailsEvent.emit({
      programIndex: programIndex,
      assessmentIndex: assessmentIndex,
      entityIndex: entityIndex
    })
  }

  openMenu(event, programIndex, assessmentIndex, entityIndex) {
    console.log("emitting")
    this.openMenuEvent.emit({
      event: event,
      programIndex: programIndex,
      assessmentIndex: assessmentIndex,
      entityIndex: entityIndex
    })
  }
}
