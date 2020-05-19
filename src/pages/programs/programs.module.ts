import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ProgramsPage } from "./programs";
import { ComponentsModule } from "../../components/components.module";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [ProgramsPage],
  imports: [
    IonicPageModule.forChild(ProgramsPage),
    ComponentsModule,
    TranslateModule,
  ],
  entryComponents: [ProgramsPage],
})
export class ProgramsPageModule {}
