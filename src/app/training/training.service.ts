import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Subject, Subscription } from 'rxjs';
import { Exercise } from './exercise.model';

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

  constructor(private db: AngularFirestore) { }

  fetchAvailableExercises() {
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
      this.availableExercises = exercises;
      this.exercisesChanged.next([...this.availableExercises]);
    }))
  }

  getRunningExerercise() {
    return {...this.runnningExercise};
  }

  startExercise(selectedId: string) {
    this.runnningExercise = this.availableExercises.find(ex => ex.id === selectedId);
    this.exerciseChanged.next({...this.runnningExercise});
  }

  completeEcercise() {
    this.addDataToDatabase({
      ...this.runnningExercise, 
      date: new Date(), 
      state: 'completed' 
    });
    this.runnningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress:any) {
    this.addDataToDatabase({
      ...this.runnningExercise, 
      duration: this.runnningExercise.duration * (progress / 100),
      calories: this.runnningExercise.calories * (progress / 100),
      date: new Date(), 
      state: 'cancelled' 
    });
    this.runnningExercise = null;
    this.exerciseChanged.next(null);
  }

  fetchCompletedOrCanceledExercises() {
    this.fbSubscription.push(this.db.collection('finishedExercises')
    .valueChanges()
    .subscribe((exercises: Exercise[]) => {
      this.finishedExercisesChanged.next(exercises);
    }));
  }

  cancelSubscriptions() {
    this.fbSubscription.forEach(sub => sub.unsubscribe());
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }
}