import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from '../welcome/welcome.component';
import { TrainingComponent } from '../training/training.component';
import { AuthGuard } from '../auth/auth.guard';


const routes: Routes = [
  { path: '', component: WelcomeComponent },
  // lazy loading: 
  { path: 'training', loadChildren: () => import('../training/training.module').then(m => m.TrainingModule), canLoad: [AuthGuard]},
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
