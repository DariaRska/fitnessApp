import { ThisReceiver } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { TrainingService } from '../training/training.service';
import { AuthData } from './auth-data.model';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authChange = new Subject<boolean>();
  // private user:User;
  private isAuthenticated:boolean = false;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService
    ) { }

    // listen at app.component.ts - one global auth listener
    initAuthListener() {
      this.afAuth.authState.subscribe(user => {
        if (user) {
          // from 
          this.isAuthenticated = true;
          this.authChange.next(true);
          this.router.navigate(['/training']);
        } else {
          // from logout
          this.trainingService.cancelSubscriptions();
          this.authChange.next(false);
          this.router.navigate(['/login']);
          this.isAuthenticated = false; 
        }
      })
    }

  registerUser(authData: AuthData) {
    this.afAuth.createUserWithEmailAndPassword(authData.email, authData.password).then(result => {
      // console.log(result);
      // this.authSuccessfully();
    })
    .catch(error => {
      console.log(error);
    })
  }

  login(authData: AuthData) {
    // angular fire wysyla token automatycznie do database po zalogowaniu i dodaje go do zapytan
    this.afAuth.signInWithEmailAndPassword(authData.email, authData.password).then(result => {
      // console.log(result);
      // this.authSuccessfully();
    })
    .catch(error => {
      console.log(error);
    })
  }

  logout() {
    this.afAuth.signOut();

  }

  isAuth() {
    // return this.user != null;
    return this.isAuthenticated;
  }

}

/*
registerUser(authData: AuthData) {
  this.user = {
    email: authData.email,
    userId: Math.round(Math.random() * 10000).toString(),
  };
  this.authSuccessfully();
}

  login(authData: AuthData) {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString(),
    };
    this.authSuccessfully();
  }

    getUser() {
    // zwracamy kopie, zeby nie mozna bylo zmienic oryginalu
    return { ...this.user };
  }

  private authSuccessfully() {
    this.isAuthenticated = true;
    this.authChange.next(true);
    this.router.navigate(['/training']);
  }

   logout() {
    // this.user = null;
    this.trainingService.cancelSubscriptions();
    this.afAuth.signOut();
    this.authChange.next(false);
    this.router.navigate(['/login']);
    this.isAuthenticated = false;

  }

*/
