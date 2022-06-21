import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TrainingService } from '../training.service';
import { StopTrainingComponent } from './stop-training/stop-training.component';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {
  // @Output() trainingExit = new EventEmitter<void>();
  progress:number = 0;
  timer:number | any = 0;

  constructor(
    private dialog: MatDialog,
    private trainingService: TrainingService
    ) { }

  ngOnInit(): void {
    this.startOrResumeTimer();
  }

  startOrResumeTimer() {
    // czas trawania dzielimy przez 100 - tj. nasza max wartosc i razy 1000 milisekund 
    const step = this.trainingService.getRunningExerercise().duration / 100 * 1000;
    this.timer = setInterval(() => {
      this.progress = this.progress +5;
      if (this.progress >= 100) {
        this.trainingService.completeEcercise();
        clearInterval(this.timer);
      }
    }, step);
  }

  onStop() {
    clearInterval(this.timer);
    const dialogRef = this.dialog.open(StopTrainingComponent, {data: {
      progress: this.progress,
    }});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.trainingExit.emit();
        this.trainingService.cancelExercise(this.progress);
      } else {
        this.startOrResumeTimer();
      }
    })
  }

}
