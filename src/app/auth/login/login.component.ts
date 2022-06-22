import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { map, Observable, Subscription } from 'rxjs';
import { UiService } from 'src/app/shared/ui.service';
import { AuthService } from '../auth.service';
import * as fromApp from '../../app.reducer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm:any;
  // isLoading:boolean = false;
  isLoading$:Observable<boolean>;
  loadingSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private uiService: UiService,
    private store: Store<fromApp.State>
    ) { }

  ngOnInit(): void {
    this.isLoading$ = this.store.pipe(map(state => state['ui'].isLoading))
    this.store.subscribe(data => console.log(data['ui'].isLoading));
    this.loginForm = new FormGroup({
      email: new FormControl('', {validators: [Validators.required, Validators.email]}),
      password: new FormControl('', {validators: [Validators.required]}),
    });
    // this.loadingSubscription = this.uiService.loadingStateChanged.subscribe(isLoading => this.isLoading = isLoading)
  }

  onSubmit() {
    this.authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    })
  }

  // ngOnDestroy(): void {
  //   if (this.loadingSubscription) {
  //     this.loadingSubscription.unsubscribe();
  //   }
  // }

}
