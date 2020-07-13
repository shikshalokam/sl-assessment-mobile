import { Component, Input } from "@angular/core";

/**
 * Generated class for the ExpansionPanel_2Component component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: "expansion-panel-2",
  templateUrl: "expansion-panel-2.html",
})
export class ExpansionPanel_2Component {
  @Input() datas;

  text: string;

  constructor() {
    console.log("Hello ExpansionPanel_2Component Component");
    this.text = "Hello World";
  }
}
