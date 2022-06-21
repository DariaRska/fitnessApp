import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Exercise } from './exercise.model';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();

  private availableExercises: Exercise[] = [
    {id: 'crunches', name: 'Crunches', duration: 30, calories: 8},
    {id: 'touch-toes', name: 'Touch Toues', duration: 180, calories: 15},
    {id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18},
    {id: 'burpees', name: 'Burpees', duration: 60, calories: 8},
  ];
  
  private runnningExercise: Exercise;
  private exercises:Exercise[] = [];

  constructor() { }

  getAvailableExercises() {
    // przez slice tworzymy nowa, ktora nie wplynie na oryginal
    return this.availableExercises.slice();
  }

  getRunningExerercise() {
    return {...this.runnningExercise};
  }

  startExercise(selectedId: string) {
    this.runnningExercise = this.availableExercises.find(ex => ex.id === selectedId);
    this.exerciseChanged.next({...this.runnningExercise});
  }

  completeEcercise() {
    this.exercises.push({
      ...this.runnningExercise, 
      date: new Date(), 
      state: 'completed' 
    });
    this.runnningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress:any) {
    this.exercises.push({
      ...this.runnningExercise, 
      duration: this.runnningExercise.duration * (progress / 100),
      calories: this.runnningExercise.calories * (progress / 100),
      date: new Date(), 
      state: 'cancelled' 
    });
    this.runnningExercise = null;
    this.exerciseChanged.next(null);
  }

  getCompletedOrCanceledExercises() {
    return this.exercises.slice();
  }
}
