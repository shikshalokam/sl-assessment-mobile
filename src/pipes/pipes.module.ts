import { NgModule } from '@angular/core';
import { CamelcasePipe } from './camelcase/camelcase';
@NgModule({
	declarations: [CamelcasePipe],
	imports: [],
	exports: [CamelcasePipe]
})
export class PipesModule {}
