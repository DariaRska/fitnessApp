import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { UiService } from '../shared/ui.service';
import { TrainingService } from '../training/training.service';
import { AuthData } from './auth-data.model';
import { Store } from '@ngrx/store';
import * as formApp from '../app.reducer';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated:boolean = false;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UiService,
    private store: Store<formApp.State>
    ) { }

    initAuthListener() {
      this.afAuth.authState.subscribe(user => {
        if (user) {
          this.isAuthenticated = true;
          this.authChange.next(true);
          this.router.navigate(['/training']);
        } else {
          this.trainingService.cancelSubscriptions();
          this.authChange.next(false);
          this.router.navigate(['/login']);
          this.isAuthenticated = false; 
        }
      })
    }

  registerUser(authData: AuthData) {
    // this.uiService.loadingStateChanged.next(true);
    this.store.dispatch({type: 'START_LOADING'});
    this.afAuth.createUserWithEmailAndPassword(authData.email, authData.password).then(result => {
      // this.uiService.loadingStateChanged.next(false);
      this.store.dispatch({type: 'STAP_LOADING'});
    })
    .catch(error => {
      this.uiService.loadingStateChanged.next(false);
     this.uiService.showSnackbar(error.message, null, 3000);
    })
  }

  login(authData: AuthData) {
    // this.uiService.loadingStateChanged.next(true);
    this.store.dispatch({type: 'START_LOADING'});
    this.afAuth.signInWithEmailAndPassword(authData.email, authData.password).then(result => {
      // this.uiService.loadingStateChanged.next(false);
      this.store.dispatch({type: 'STAP_LOADING'});
    })
    .catch(error => {
      // this.uiService.loadingStateChanged.next(false);
      this.store.dispatch({type: 'STAP_LOADING'});
      this.uiService.showSnackbar(error.message, null, 3000);
    })
  }

  logout() {
    this.afAuth.signOut();

  }

  isAuth() {
    return this.isAuthenticated;
  }

}
