import { Component, Input, OnInit } from "@angular/core";

/**
 * Generated class for the ReportsTextComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: "reports-text",
  templateUrl: "reports-text.html",
})
export class ReportsTextComponent {
  @Input() data;
  @Input() questionNumber;
  @Input() showMore;
  count = 10;

  constructor() {
    console.log("Hello ReportsTextComponent Component");
  }
}
