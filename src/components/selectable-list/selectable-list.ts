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
  @Input() list;
  @Input() itemsPerShot;

  text: string;

  constructor() {
    console.log('Hello SelectableListComponent Component');
    this.text = 'Hello World';
  }
  doInfinite(infiniteScroll) {
    console.log("doInfinite function called");
    setTimeout(() => {
      for (let i=0 ; ( i < 10 ) &&( this.itemsPerShot < this.list.length); i++ ) {
        this.selectableList.push( this.list[this.itemsPerShot++] );
      }
      infiniteScroll.complete();
    }, 500);
  }
}
