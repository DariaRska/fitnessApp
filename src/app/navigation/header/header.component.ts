import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import * as formRoot from '../../app.reducer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() sideNavToggle = new EventEmitter<void>();
  // isAuth:boolean = false;
  isAuth$:Observable<boolean>;
  subscription:Subscription;

  constructor(
    private authService: AuthService,
    private store: Store<formRoot.State>
    ) { }

  ngOnInit(): void {
    // this.subscription = this.authService.authChange.subscribe(authStatus => {
    //   this.isAuth = authStatus;
    // })
    this.isAuth$ = this.store.select(formRoot.getIsAuth);
  }

  onToggleSidenav() {
    this.sideNavToggle.emit();
  }

  onLogout() {
    this.authService.logout();
  }

  // ngOnDestroy(): void {
  //   if (this.subscription) {
  //   this.subscription.unsubscribe();
  //   }
  // }

}
