import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-past-training',
  templateUrl: './past-training.component.html',
  styleUrls: ['./past-training.component.css']
})
export class PastTrainingComponent implements OnInit, AfterViewInit {
  displayedColumns = ['date', 'name', 'duration', 'calories', 'state'];
  // exercises jest array, ale table zawsze oczekuje array, wiec nie trzeba tego tutaj zawierac
  dataSource = new MatTableDataSource<Exercise>();

  @ViewChild(MatSort) sort: MatSort;
  // viewchild lub local reference
  @ViewChild(MatPaginator) matPaginator: MatPaginator;

  constructor(private trainingService: TrainingService) { }

  ngOnInit(): void {
    this.dataSource.data = this.trainingService.getCompletedOrCanceledExercises();
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

}
