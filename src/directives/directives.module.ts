import { NgModule } from '@angular/core';
import { SwitchTemplateDirective } from './switch-template/switch-template';
import { ImageResolverDirective } from './image-resolver/image-resolver';
@NgModule({
	declarations: [SwitchTemplateDirective,
    ImageResolverDirective],
	imports: [],
	exports: [SwitchTemplateDirective,
    ImageResolverDirective]
})
export class DirectivesModule {}
