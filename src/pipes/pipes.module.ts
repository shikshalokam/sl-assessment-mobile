import { NgModule } from '@angular/core';
import { CamelcasePipe } from './camelcase/camelcase';
import { GetLabelsPipe } from './get-labels/get-labels';
import { SearchPipe } from './search/search';
@NgModule({
	declarations: [CamelcasePipe,
    GetLabelsPipe,
    SearchPipe],
	imports: [],
	exports: [CamelcasePipe,
    GetLabelsPipe,
    SearchPipe]
})
export class PipesModule {}
