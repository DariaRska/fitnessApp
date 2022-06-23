import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import * as formRoot from '../../app.reducer';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {
  @Output() closeSidenav = new EventEmitter<void>();
  // isAuth:boolean = false;
  isAuth$: Observable<boolean>;
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

  onClose() {
    this.closeSidenav.emit();
  }

  onLogout() {
    this.authService.logout();
    this.onClose();
  }

  // ngOnDestroy(): void {
  //   if (this.subscription) {
  //   this.subscription.unsubscribe();
  //   }
  // }

}
