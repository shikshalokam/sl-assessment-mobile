import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavController, NavParams, PopoverController } from 'ionic-angular';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { EvidenceProvider } from '../../providers/evidence/evidence';
import { UtilsProvider } from '../../providers/utils/utils';
import { GenericMenuPopOverComponent } from '../generic-menu-pop-over/generic-menu-pop-over';
import { EntityListingComponent } from '../entity-listing/entity-listing';
import { AssessmentAboutPage } from '../../pages/assessment-about/assessment-about';

/**
 * Generated class for the ProgramListingComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'program-listing',
  templateUrl: 'program-listing.html'
})
export class ProgramListingComponent {

  @Input() programList;
  @Input() entityType;
  @Input() assessmentlocalStorageName;
  
  @Input() showMenu = true;
  @Output() getAssessmentDetailsEvent = new EventEmitter();
  @Output() openMenuEvent = new EventEmitter();
  @Input() enableAddRemoveEntityButton = false;
  @Output() goToEntity = new EventEmitter()
  text: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private localStorage: LocalStorageProvider,
    private evdnsServ: EvidenceProvider,
    private popoverCtrl : PopoverController,
    private utils: UtilsProvider) {
      
  }


  // openMenu(event , index) {
  //   // this.assessmentService.openMenu(event, this.programs, false);
  //   console.log("open menu")
  //   let popover = this.popoverCtrl.create(GenericMenuPopOverComponent , { showAbout : true , assessmentIndex : index , assessmentName :this.assessmentlocalStorageName})
  
  //   popover.present(
  //     {ev:event}
  //     );
      
  // }
  openAbout(index){
    console.log(this.entityType)
    this.navCtrl.push(AssessmentAboutPage , {assessmentIndex : index  , assessmentName : this.entityType+"List"})
  }
  goToEntityFunc(programIndex){
    this.goToEntity.emit(programIndex);
  }

}
