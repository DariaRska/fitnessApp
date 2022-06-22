import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-past-training',
  templateUrl: './past-training.component.html',
  styleUrls: ['./past-training.component.css']
})
export class PastTrainingComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['date', 'name', 'duration', 'calories', 'state'];
  // exercises jest array, ale table zawsze oczekuje array, wiec nie trzeba tego tutaj zawierac
  dataSource = new MatTableDataSource<Exercise>();

  @ViewChild(MatSort) sort: MatSort;
  // viewchild lub local reference
  @ViewChild(MatPaginator) matPaginator: MatPaginator;

  private exChangedSubscription: Subscription;

  constructor(private trainingService: TrainingService) { }

  ngOnInit(): void {
    // this.dataSource.data = this.trainingService.getCompletedOrCanceledExercises();
    this.exChangedSubscription = this.trainingService.finishedExercisesChanged.subscribe((exercises: Exercise[]) => {
      const exercisesWithGoodDate = exercises.map(exercise => {
        // firebase zwracalo timestamp, zamiast daty, ktora zostala zapisana
        return {...exercise, date: new Date(exercise.date['seconds'] * 1000)}
      })
      this.dataSource.data = exercisesWithGoodDate;
    })
    this.trainingService.fetchCompletedOrCanceledExercises();
  }

  ngAfterViewInit(): void {
    // view done rendering and initializing
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.matPaginator;
  }

  // doFilter(filterValue: HTMLInputElement) {
  doFilter(event: any) {
    const filterValue = event.target.value;
    // usuwamy spacje, zmieniamy na lower case - tabela z angular material wszytsko concact z one row jako string
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  ngOnDestroy(): void {
    this.exChangedSubscription.unsubscribe();
  }

}
