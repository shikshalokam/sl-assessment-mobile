import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { NetworkGpsProvider } from '../../providers/network-gps/network-gps';
import { UtilsProvider } from '../../providers/utils/utils';

@Component({
  selector: 'footer-buttons',
  templateUrl: 'footer-buttons.html'
})
export class FooterButtonsComponent implements OnChanges {

  text: string;
  _data;
  
  @Input()updatedData;
  @Input()
  get data() {
    return this._data
  }
  set data(data) {
    this._data = {...data};
  }
  @Input() isFirst: boolean;
  @Input() isLast: boolean;
  @Output() nextAction = new EventEmitter();
  @Output() backAction = new EventEmitter();
  @Input() completedQuestionCount = 0;
  @Input() questionCount = 0;
  @Input() isSubmitted;
  @Input() enableGps;
  
  percentage: number = 0;

  constructor(private ngps: NetworkGpsProvider, private utils: UtilsProvider) {

  }
  ngOnChanges() {
    if (this.completedQuestionCount > 0) {
      this.percentage = this.questionCount ? (this.completedQuestionCount / this.questionCount) * 100 : 0;
      this.percentage = Math.trunc(this.percentage)
    }
    else {

      this.percentage = this.isSubmitted ? 100 : 0;
      this.completedQuestionCount = this.isSubmitted ? this.questionCount : 0;
    }
  }
  next(status?: string): void {
    this.nextAction.emit(status);
  }

  back(): void {
    this.backAction.emit();
  }

  gpsFlowChecks(action,status) {
    // console.log(JSON.stringify(this.data))
    if(JSON.stringify(this._data.value) === JSON.stringify(this.updatedData.value)){
    } else {
      this.utils.startLoader();
      this.ngps.getGpsStatus().then(success => {
        this.updatedData.gpsLocation = success;
        this.utils.stopLoader();
        if(action ==='next'){
          this.next(status);
        } else {
          this.back();
        }
      }).catch(error => {
        this.utils.stopLoader();
      })
    }

  }

}
