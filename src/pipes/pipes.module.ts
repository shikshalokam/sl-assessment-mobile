import { NgModule } from '@angular/core';
import { CamelcasePipe } from './camelcase/camelcase';
import { GetLabelsPipe } from './get-labels/get-labels';
@NgModule({
	declarations: [CamelcasePipe,
    GetLabelsPipe],
	imports: [],
	exports: [CamelcasePipe,
    GetLabelsPipe]
})
export class PipesModule {}
