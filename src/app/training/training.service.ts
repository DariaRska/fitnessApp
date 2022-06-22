//  npm install angularfire2 firebase --save
// stara wejsja 

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Subject } from 'rxjs';
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

  constructor(private db: AngularFirestore) { }

  fetchAvailableExercises() {
    this.db.collection('availableExercises')
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
    })
  }

  getRunningExerercise() {
    return {...this.runnningExercise};
  }

  startExercise(selectedId: string) {
    // updateone document with new data 
    // this.db.doc('availableExercises' + selectedId).update({lastSelected: new Date()});
    this.runnningExercise = this.availableExercises.find(ex => ex.id === selectedId);
    this.exerciseChanged.next({...this.runnningExercise});
  }

  completeEcercise() {
    // this.exercises.push({
    this.addDataToDatabase({
      ...this.runnningExercise, 
      date: new Date(), 
      state: 'completed' 
    });
    this.runnningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress:any) {
    // this.exercises.push({
    this.addDataToDatabase({
      ...this.runnningExercise, 
      duration: this.runnningExercise.duration * (progress / 100),
      calories: this.runnningExercise.calories * (progress / 100),
      date: new Date(), 
      state: 'cancelled' 
    });
    this.runnningExercise = null;
    this.exerciseChanged.next(null);
    console.log(new Date())
  }

  fetchCompletedOrCanceledExercises() {
    this.db.collection('finishedExercises')
    .valueChanges()
    .subscribe((exercises: Exercise[]) => {
      this.finishedExercisesChanged.next(exercises);
    });
  }

  private addDataToDatabase(exercise: Exercise) {
    // zwraca promise, jak nie ma collection, to ja tworzy
    this.db.collection('finishedExercises').add(exercise);
  }
}


  // private availableExercises: Exercise[] = [
  //   {id: 'crunches', name: 'Crunches', duration: 30, calories: 8},
  //   {id: 'touch-toes', name: 'Touch Toues', duration: 180, calories: 15},
  //   {id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18},
  //   {id: 'burpees', name: 'Burpees', duration: 60, calories: 8},
  // ];

    // getAvailableExercises() {
  //   // przez slice tworzymy nowa, ktora nie wplynie na oryginal
  //   return this.availableExercises.slice();
  // }

  // getCompletedOrCanceledExercises() {
  //   return this.exercises.slice();
  // }
