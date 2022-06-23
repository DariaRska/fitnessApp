import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Subscription, take } from 'rxjs';
import { UiService } from '../shared/ui.service';
import { Exercise } from './exercise.model';
import * as UI from '../shared/ui.actions';
import { Store } from '@ngrx/store';
import * as fromTraining from './training.reducer';
import * as Training from './training.actions';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {  
  private fbSubscription: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private uiService: UiService,
    // z training state mamy dostep do global state, bo trainingState extends global, ale global nie wie o training state, dltego z global nie mamy dostepu do training state
    private store: Store<fromTraining.State>
    ) { }

  fetchAvailableExercises() {
    this.store.dispatch(new UI.StartLoading());
    this.fbSubscription.push(this.db.collection('availableExercises')
    .snapshotChanges()
    .pipe(
      map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            name: doc.payload.doc.data()['name'],
            duration: doc.payload.doc.data()['duration'],
            calories: doc.payload.doc.data()['calories'],
          }
        })
      })
    ).subscribe((exercises: Exercise[]) => {
      this.store.dispatch(new UI.StopLoading());
      this.store.dispatch(new Training.SetAvailableTrainings(exercises));
    }, error => {
      this.store.dispatch(new UI.StopLoading());
      this.uiService.showSnackbar('Fetching Exercises failed, please try again later', null, 3000);
    }))
  }

  startExercise(selectedId: string) {
    this.store.dispatch(new Training.StartTraining(selectedId));
  }

  completeEcercise() {
    this.store.select(fromTraining.getActiveExercise)
    .pipe(take(1))
    .subscribe(ex => {
      this.addDataToDatabase({
        ...ex, 
        date: new Date(), 
        state: 'completed' 
      });
      this.store.dispatch(new Training.StopTraining());
    })
  }

  cancelExercise(progress:any) {
    this.store.select(fromTraining.getActiveExercise)
    .pipe(take(1))
    .subscribe(ex => {
      this.addDataToDatabase({
        ...ex, 
        duration: ex.duration * (progress / 100),
      calories: ex.calories * (progress / 100),
        date: new Date(), 
        state: 'cancelled' 
      });
      this.store.dispatch(new Training.StopTraining());
    })
  }

  fetchCompletedOrCanceledExercises() {
    this.fbSubscription.push(this.db.collection('finishedExercises')
    .valueChanges()
    .subscribe((exercises: Exercise[]) => {
      this.store.dispatch(new Training.SetFinishedTrainings(exercises));
    }));
  }

  cancelSubscriptions() {
    this.fbSubscription.forEach(sub => sub.unsubscribe());
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }
}