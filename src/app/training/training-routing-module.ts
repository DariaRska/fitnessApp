import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../auth/auth.guard";
import { TrainingComponent } from "./training.component";

const routes: Routes = [
    { path: '', component: TrainingComponent, canActivate: [AuthGuard] }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    // providers: [AuthGuard] - jest zostawione w app-routing, ktory jest w glownym app.component, wiec juz ten routing ma do niego dostep
})
export class TrainingRoutingModule {}