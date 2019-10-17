import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { UtilsProvider } from '../../providers/utils/utils';

/**
 * Generated class for the PageQuestionComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'page-question',
  templateUrl: 'page-question.html'
})
// export class PageQuestionComponent {
  export class PageQuestionComponent implements OnInit, OnDestroy  {
  @Input() inputIndex ;
  @Input() data: any;
  @Input() isLast: boolean;
  @Input() isFirst: boolean;
  @Output() nextCallBack = new EventEmitter();
  @Output() updateLocalData = new EventEmitter();
  @Output() previousCallBack = new EventEmitter()
  @Input() evidenceId: string;
  @Input() hideButton: boolean;
  @Input() submissionId: any;
  @Input() imageLocalCopyId: string;
  @Input() generalQuestion: boolean;
  @Input() schoolId;
  notNumber: boolean;
  questionValid: boolean;
  text: string;

  constructor(private utils : UtilsProvider) {
    console.log('Hello PageQuestionComponent Component');
    this.text = 'Hello World';
  }

  ngOnDestroy() {
    console.log(JSON.stringify(this.data))
    for (const question of this.data.pageQuestions) {
      // Do check only for questions without visibleif. For visibleIf questions isCompleted property is set in  checkForVisibility()
      if (!question.visibleIf) {
        question.isCompleted = this.utils.isQuestionComplete(question);
      }
    }
  }
  ngOnInit() {
    this.data.startTime = this.data.startTime ? this.data.startTime : Date.now();
  }

  // ngOnDestroy(){}
  // ngOnChanges(changes: SimpleChanges) {
  //   for (let propName in changes) {
  //     let chng = changes[propName];
  //     let cur  = JSON.stringify(chng.currentValue);
  //     let prev = JSON.stringify(chng.previousValue);
  //      console.log("NG ON DESTORY")
  //         this.data.isCompleted = this.utils.isPageQuestionComplete(this.data);
  //         // this.data.isCompleted = true;
  //         // this.data.pageQuestions.array.forEach(element => {
  //         //   if(!element.isCompleted){
  //         //     this.data.isCompleted = false;
  //         //   }
  //         // }); this.utils.isQuestionComplete(this.data.pageQuestions)
  //   }
  // }
  // ngOnInit() {
  //   console.log("hello");
  //   // this.isaNumber();
  //   this.data.startTime = this.data.startTime ? this.data.startTime : Date.now();
  //   // this.getErrorMsg();
  //   // this.checkForValidation();
  //   console.log(JSON.stringify(this.data))
  // }
  updateLocalDataInPageQuestion(): void {
    this.updateLocalData.emit();
  }

  checkForVisibility(currentQuestionIndex) {
    const currentQuestion = this.data.pageQuestions[currentQuestionIndex];
    let display = true;
    for (const question of this.data.pageQuestions) {
      for (const condition of currentQuestion.visibleIf) {
        if (condition._id === question._id) {
          let expression = [];
          if (condition.operator != "===") {
            if (question.responseType === 'multiselect') {
              for (const parentValue of question.value) {
                for (const value of condition.value) {
                  expression.push("(", "'" + parentValue + "'", "===", "'" + value + "'", ")", condition.operator);
                }
              }
            } else {
              for (const value of condition.value) {
                expression.push("(", "'" + question.value + "'", "===", "'" + value + "'", ")", condition.operator)
              }
            }
            expression.pop();
          } else {
            if (question.responseType === 'multiselect') {
              for (const value of question.value) {
                expression.push("(", "'" + condition.value + "'", "===", "'" + value + "'", ")", "||");
              }
              expression.pop();
            } else {
              expression.push("(", "'" + question.value + "'", condition.operator, "'" + condition.value + "'", ")")
            }
          }
          if (!eval(expression.join(''))) {
            this.data.pageQuestions[currentQuestionIndex].isCompleted = true;
            return false
          } else {
            this.data.pageQuestions[currentQuestionIndex].isCompleted = this.utils.isQuestionComplete(currentQuestion);
          }
        }
      }
    }
    return display
  }

}
