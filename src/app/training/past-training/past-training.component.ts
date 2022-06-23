import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import * as formTraining from '../training.reducer';

@Component({
  selector: 'app-past-training',
  templateUrl: './past-training.component.html',
  styleUrls: ['./past-training.component.css']
})
export class PastTrainingComponent implements OnInit, AfterViewInit {
  displayedColumns = ['date', 'name', 'duration', 'calories', 'state'];
  dataSource = new MatTableDataSource<Exercise>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) matPaginator: MatPaginator;

  // private exChangedSubscription: Subscription;

  constructor(
    private trainingService: TrainingService,
    private store: Store<formTraining.State>
    ) { }

  ngOnInit(): void {
    // this.exChangedSubscription = this.trainingService.finishedExercisesChanged.subscribe((exercises: Exercise[]) => {
    //   const exercisesWithGoodDate = exercises.map(exercise => {
    //     return {...exercise, date: new Date(exercise.date['seconds'] * 1000)}
    //   })
    //   this.dataSource.data = exercisesWithGoodDate;
    // })
    this.store.select(formTraining.getFinishedExercises).subscribe((exercises: Exercise[]) => {
      const exercisesWithGoodDate = exercises.map(exercise => {
        return {...exercise, date: new Date(exercise.date['seconds'] * 1000)}
      })
      this.dataSource.data = exercisesWithGoodDate;
    })
    this.trainingService.fetchCompletedOrCanceledExercises();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.matPaginator;
  }

  doFilter(event: any) {
    const filterValue = event.target.value;
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  // ngOnDestroy(): void {
  //   if (this.exChangedSubscription) {
  //     this.exChangedSubscription.unsubscribe();
  //   }
  // }

}
