import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import {  Subscription } from 'rxjs';
import { UiService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises: Exercise[] = [];
  exerciseSubscription: Subscription;
  isLoading: boolean = true;
  private loadingSub: Subscription;

  constructor(
    private trainingService: TrainingService,
    private uiService: UiService
    ) { }

  ngOnInit(): void {
    this.loadingSub = this.uiService.loadingStateChanged.subscribe( (isLoading) => {
      this.isLoading = isLoading
    }
    );
    this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(exercises => {
      // TAK LUB, TAK JAK JEST PRZEZ UIsERVICE POWYZEJ
      // this.isLoading = false;
      this.exercises = exercises;
    });
    this.fetchExercises();
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy(): void {
    this.exerciseSubscription.unsubscribe();
    this.loadingSub.unsubscribe();
  }

}