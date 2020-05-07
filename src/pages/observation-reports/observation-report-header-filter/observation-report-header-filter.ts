import { Component, Output, EventEmitter, Input } from "@angular/core";
import { ModalController } from "ionic-angular";
import { QuestionListPage } from "../../question-list/question-list";

/**
 * Generated class for the ObservationReportHeaderFilterComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: "observation-report-header-filter",
  templateUrl: "observation-report-header-filter.html",
})
export class ObservationReportHeaderFilterComponent {
  text: string;
  @Output() openFilterEvent = new EventEmitter();
  @Input() allQuestions: any;
  @Input() filteredQuestions: any;

  constructor(private modal: ModalController) {
    console.log("Hello ObservationReportHeaderFilterComponent Component");
    this.text = "Hello World";
  }

  openFilter() {
    // this.openFilterEvent.emit();
    const modal = this.modal.create(QuestionListPage, {
      allQuestions: this.allQuestions,
      filteredQuestions: JSON.parse(JSON.stringify(this.filteredQuestions)),
    });
    modal.present();
    modal.onDidDismiss((response) => {
      if (
        response &&
        response.action === "updated" &&
        JSON.stringify(response.filter) !==
          JSON.stringify(this.filteredQuestions)
      ) {
        this.filteredQuestions = response.filter;
        // this.getObservationReports();
      }
    });
  }
}
