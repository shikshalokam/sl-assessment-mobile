import { Component, Input } from '@angular/core';

/**
 * Generated class for the SelectableListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'selectable-list',
  templateUrl: 'selectable-list.html'
})
export class SelectableListComponent {
  @Input() selectableList;
   list;
   @Input() index = 10 ;

  text: string;

  constructor() {
    console.log('Hello SelectableListComponent Component');
    this.text = 'Hello World';
    this.list = this.selectableList.slice(0,this.index-1);
  }
  doInfinite(infiniteScroll) {
    console.log("doInfinite function called");
    setTimeout(() => {
      for (let i=0 ; ( i < 10 ) &&( this.index < this.selectableList.length); i++ ) {
        this.list.push( this.selectableList[this.index++] );
      }
      infiniteScroll.complete();
    }, 500);
  }
}
