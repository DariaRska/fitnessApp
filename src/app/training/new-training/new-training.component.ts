import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  // @Output() trainingStart = new EventEmitter<void>();
  exercises: Exercise[] = [];
  // exercises: Observable<any>;
  exerciseSubscription: Subscription;

  constructor(
    private trainingService: TrainingService,
    // private db: AngularFirestore
    ) { }

  ngOnInit(): void {
    this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(exercises => this.exercises = exercises);
    // nie musimy tego poniezej sami odsybsktubowac, bo mamy zawsze tylko jedna subskryocje wazna, mozna sprawdzic przez console.log w subscribe w serwisie 
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    // this.trainingStart.emit();
    this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy(): void {
    this.exerciseSubscription.unsubscribe();
  }

}

/* oninit:
    // this.exercises = this.trainingService.getAvailableExercises();
    // valueChanges nie pokazuje id - jest traktowane jako meta data 
    // this.exercises = this.db.collection('availableExercises').valueChanges();
    this.exercises = this.db.collection('availableExercises')
    .snapshotChanges()
    .pipe(
      map(docArray => {
        return docArray.map(doc => {
          // lub ...data zamiast kazdego po kolei
          // const data:any = doc.payload.doc.data();
          return {
            id: doc.payload.doc.id,
            name: doc.payload.doc.data()['name'],
            duration: doc.payload.doc.data()['duration'],
            calories: doc.payload.doc.data()['calories'],
          }
        })
      })
    )
    // .subscribe(result => {
    //   // for (const res of result) {
    //   //   console.log(res.payload.doc.data());
    //   // }
    // });
    */
