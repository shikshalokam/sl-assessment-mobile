import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ProgramsPage } from "./programs";
import { ComponentsModule } from "../../components/components.module";
import { TranslateModule } from "@ngx-translate/core";
import { ProgramServiceProvider } from "./program-service";
import { ProgramSolutionPage } from "./program-solution/program-solution";
import { ProgramSolutionEntityPage } from "./program-solution-entity/program-solution-entity";
import { ProgramSolutionComponent } from "./program-solution/program-solution/program-solution";

@NgModule({
  declarations: [ProgramsPage, ProgramSolutionPage, ProgramSolutionEntityPage],
  imports: [
    IonicPageModule.forChild(ProgramsPage),
    ComponentsModule,
    TranslateModule,
  ],
  providers: [ProgramServiceProvider],
  entryComponents: [
    ProgramsPage,
    ProgramSolutionPage,
    ProgramSolutionEntityPage,
  ],
})
export class ProgramsPageModule {}
