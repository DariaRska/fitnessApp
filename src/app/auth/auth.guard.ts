import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable, take } from "rxjs";
// import { AuthService } from "./auth.service";
import * as fromRoot from '../app.reducer';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
    constructor(
        // private authService: AuthService,
        private router: Router,
        private store: Store<fromRoot.State>
        ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        // if (this.authService.isAuth()) {
        //     return true;
        // } else {
        //     return this.router.navigate(['/login']);
        // }
        return this.store.select(fromRoot.getIsAuth);
    }

    canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    //     if (this.authService.isAuth()) {
    //         return true;
    //     } else {
    //         return this.router.navigate(['/login']);
    //     }
    // }
    // return this.store.select(fromRoot.getIsAuth);
    // MOZE WYSTAPIC BLAD, BIERZE TYLKO JEDNA WARTOSC I JA ZWRACA
    return this.store.select(fromRoot.getIsAuth).pipe(take(1));
}
}