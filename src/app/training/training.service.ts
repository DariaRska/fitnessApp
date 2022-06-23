import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Subject, Subscription } from 'rxjs';
import { UiService } from '../shared/ui.service';
import { Exercise } from './exercise.model';
// import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';
import { Store } from '@ngrx/store';
import * as ftomTraining from './training.reducer';
import * as Training from './training.actions';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  
  private runnningExercise: Exercise;
  private availableExercises: Exercise[] = [];
  private fbSubscription: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private uiService: UiService,
    // z training state mamy dostep do global state, bo trainingState extends global, ale global nie wie o training state, dltego z global nie mamy dostepu do training state
    private store: Store<ftomTraining.State>
    ) { }

  fetchAvailableExercises() {
    // this.uiService.loadingStateChanged.next(true);
    this.store.dispatch(new UI.StartLoading());
    this.fbSubscription.push(this.db.collection('availableExercises')
    .snapshotChanges()
    .pipe(
      map(docArray => {
        // throw(new Error()); - do testowania pezycisku fetch again, reszte trzeba zakomentowac wtedy
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
      // this.uiService.loadingStateChanged.next(false);
      this.store.dispatch(new UI.StopLoading());
      // this.availableExercises = exercises;
      // this.exercisesChanged.next([...this.availableExercises]);
      this.store.dispatch(new Training.SetAvailableTrainings(exercises));
    }, error => {
      // this.uiService.loadingStateChanged.next(false);
      this.store.dispatch(new UI.StopLoading());
      this.uiService.showSnackbar('Fetching Exercises failed, please try again later', null, 3000);
      this.exercisesChanged.next(null);
    }))
  }

  getRunningExerercise() {
    return {...this.runnningExercise};
  }

  startExercise(selectedId: string) {
    // this.runnningExercise = this.availableExercises.find(ex => ex.id === selectedId);
    // this.exerciseChanged.next({...this.runnningExercise});
    this.store.dispatch(new Training.StartTraining(selectedId));
  }

  completeEcercise() {
    this.addDataToDatabase({
      ...this.runnningExercise, 
      date: new Date(), 
      state: 'completed' 
    });
    // this.runnningExercise = null;
    // this.exerciseChanged.next(null);
    this.store.dispatch(new Training.StopTraining());
  }

  cancelExercise(progress:any) {
    this.addDataToDatabase({
      ...this.runnningExercise, 
      duration: this.runnningExercise.duration * (progress / 100),
      calories: this.runnningExercise.calories * (progress / 100),
      date: new Date(), 
      state: 'cancelled' 
    });
    // this.runnningExercise = null;
    // this.exerciseChanged.next(null);
    this.store.dispatch(new Training.StopTraining());
  }

  fetchCompletedOrCanceledExercises() {
    this.fbSubscription.push(this.db.collection('finishedExercises')
    .valueChanges()
    .subscribe((exercises: Exercise[]) => {
      // this.finishedExercisesChanged.next(exercises);
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