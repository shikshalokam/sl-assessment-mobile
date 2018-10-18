import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'footer-buttons',
  templateUrl: 'footer-buttons.html'
})
export class FooterButtonsComponent {

  text: string;
  @Input() data;
  @Input() isFirst: boolean;
  @Input() isLast: boolean;
  @Output() nextAction = new EventEmitter();
  @Output() backAction = new EventEmitter();

  constructor() {
  }

  next(status?: string): void {
    this.nextAction.emit(status);
  }

  back(): void {
    this.backAction.emit();
  }

}
