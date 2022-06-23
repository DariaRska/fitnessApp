import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromTraining from './training.reducer';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit {
  // ongoingTraining:boolean = false;
  ongoingTraining$: Observable<boolean>;
  // exerciseSubscription: Subscription;

  constructor(
    // private trainingService: TrainingService,
    private store: Store<fromTraining.State>
    ) { }

  ngOnInit(): void {
    this.ongoingTraining$ = this.store.select(fromTraining.getIsTraining);
    // this.exerciseSubscription = this.trainingService.exerciseChanged.subscribe(exercise => {
    //   if (exercise) {
    //     this.ongoingTraining = true;
    //   } else {
    //     this.ongoingTraining = false;
    //   }
    // })
  }

  // ngOnDestroy(): void {
  //   if (this.exerciseSubscription) {
  //     this.exerciseSubscription.unsubscribe();
  //   }
  // }

}
