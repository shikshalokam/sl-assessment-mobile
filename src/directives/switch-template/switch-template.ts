import { Directive, Input, ComponentFactoryResolver, ViewContainerRef, OnInit } from '@angular/core';
import { InputTypeComponent } from '../../components/input-type/input-type';
import { RadioTypeComponent } from '../../components/radio-type/radio-type';

/**
 * Generated class for the SwitchTemplateDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[switchTemplate]' // Attribute selector
})
export class SwitchTemplateDirective implements OnInit {
  @Input() type;
  @Input() data;

  constructor(private cfr: ComponentFactoryResolver, private vcr: ViewContainerRef) {


  }

  ngOnInit() {
    let component: any;
    console.log(this.type);
    console.log('Hello SwitchTemplateDirective Directive');
    switch (this.type) {
      case "text": case "number": default:
        component = this.cfr.resolveComponentFactory(InputTypeComponent).create(this.vcr.injector);
        break
      case 'radiogroup':
        component = this.cfr.resolveComponentFactory(RadioTypeComponent).create(this.vcr.injector);
    }
    this.vcr.clear();
    component.instance.data = this.data;
    // component.instance.callBack = this.call
    this.vcr.insert(component.hostView);

  }
}
