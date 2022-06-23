import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { UiService } from '../shared/ui.service';
import { TrainingService } from '../training/training.service';
import { AuthData } from './auth-data.model';
import { Store } from '@ngrx/store';
import * as formRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';

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
    private store: Store<formRoot.State>
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
    // this.store.dispatch({type: 'START_LOADING'});
    this.store.dispatch(new UI.StartLoading());
    this.afAuth.createUserWithEmailAndPassword(authData.email, authData.password).then(result => {
      // this.uiService.loadingStateChanged.next(false);
      // this.store.dispatch({type: 'STOP_LOADING'});
      this.store.dispatch(new UI.StopLoading());
    })
    .catch(error => {
      this.uiService.loadingStateChanged.next(false);
     this.uiService.showSnackbar(error.message, null, 3000);
    })
  }

  login(authData: AuthData) {
    // this.uiService.loadingStateChanged.next(true);
    // this.store.dispatch({type: 'START_LOADING'});
    this.store.dispatch(new UI.StartLoading());
    this.afAuth.signInWithEmailAndPassword(authData.email, authData.password).then(result => {
      // this.uiService.loadingStateChanged.next(false);
      // this.store.dispatch({type: 'STOP_LOADING'});
      this.store.dispatch(new UI.StopLoading());
    })
    .catch(error => {
      // this.uiService.loadingStateChanged.next(false);
      // this.store.dispatch({type: 'STOP_LOADING'});
      this.store.dispatch(new UI.StopLoading());
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
