import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import {  Observable, Subscription } from 'rxjs';
import { UiService } from 'src/app/shared/ui.service';
import * as fromRoot from '../../app.reducer';
import { Store } from '@ngrx/store';
import * as fromTraining from '../training.reducer';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  // exercises: Exercise[] = [];
  exercises$: Observable<Exercise[]>;
  exerciseSubscription: Subscription;
  // isLoading: boolean = true;
  isLoading$:Observable<boolean>;
  // private loadingSub: Subscription;

  constructor(
    private trainingService: TrainingService,
    private uiService: UiService,
    // private store: Store<fromRoot.State>
    private store: Store<fromTraining.State>
    ) { }

  ngOnInit(): void {
    // this.loadingSub = this.uiService.loadingStateChanged.subscribe( (isLoading) => {
    //   this.isLoading = isLoading
    // }
    // );
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    // this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(exercises => {
    //   // TAK LUB, TAK JAK JEST PRZEZ UIsERVICE POWYZEJ
    //   // this.isLoading = false;
    //   this.exercises = exercises;
    // });
    this.exercises$ = this.store.select(fromTraining.getAvailableExercises);
    this.fetchExercises();
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  // ngOnDestroy(): void {
  //   if (this.exerciseSubscription) {
  //   this.exerciseSubscription.unsubscribe();
  //   }
  //   if (this.loadingSub) {
  //     this.loadingSub.unsubscribe();
  //   }
  // }

}