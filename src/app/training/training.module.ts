import { NgModule } from "@angular/core";
import { CurrentTrainingComponent } from "./current-training/current-training.component";
import { StopTrainingComponent } from "./current-training/stop-training/stop-training.component";
import { NewTrainingComponent } from "./new-training/new-training.component";
import { PastTrainingComponent } from "./past-training/past-training.component";
import { TrainingComponent } from "./training.component";
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { SharedModule } from "../shared/shared.module";
import { TrainingRoutingModule } from "./training-routing-module";
import { StoreModule } from "@ngrx/store";
import { trainingReducer } from "./training.reducer";


@NgModule({
    declarations: [
        TrainingComponent,
        CurrentTrainingComponent,
        NewTrainingComponent,
        PastTrainingComponent,
        StopTrainingComponent
    ],
    imports: [
        SharedModule,
        AngularFirestoreModule,
        TrainingRoutingModule,
        // deklarujemy tutaj a nie w glownym app reducer, bo to jest lazy loading
        StoreModule.forFeature('training', trainingReducer)
    ],
    exports: [],
})
export class TrainingModule {}