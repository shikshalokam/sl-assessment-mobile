import { NgModule } from '@angular/core';
import { InputTypeComponent } from './input-type/input-type';
import { RadioTypeComponent } from './radio-type/radio-type';
import { IonicModule } from 'ionic-angular';
import { MultipleChoiceTypeComponent } from './multiple-choice-type/multiple-choice-type';
import { DateTypeComponent } from './date-type/date-type';
import { RemarksComponent } from './remarks/remarks';
import { ImageUploadComponent } from './image-upload/image-upload';
import { DirectivesModule } from '../directives/directives.module';
import { MatrixTypeComponent } from './matrix-type/matrix-type';

@NgModule({
	declarations: [
		InputTypeComponent,
		RadioTypeComponent,
    MultipleChoiceTypeComponent,
    DateTypeComponent,
    RemarksComponent,
    ImageUploadComponent,
    MatrixTypeComponent],
	imports: [
		IonicModule,
		DirectivesModule
	],
	exports: [
		InputTypeComponent,
		RadioTypeComponent,
    MultipleChoiceTypeComponent,
    DateTypeComponent,
    RemarksComponent,
    ImageUploadComponent,
    MatrixTypeComponent
	],
	entryComponents: [
		InputTypeComponent,
		RadioTypeComponent
	]
})
export class ComponentsModule { }
