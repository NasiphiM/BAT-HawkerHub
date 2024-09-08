import { Injectable } from '@angular/core';
import { UrlTree, CanLoad, Route, UrlSegment, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap, take, withLatestFrom } from 'rxjs/operators';
import {LoginService} from "../services/login.service";

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  constructor(private loginService: LoginService, private router: Router) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.loginService.isAuthenticated
      .pipe(
        take(1),
        switchMap((isAuthenticated) => {
          if (!isAuthenticated) {
            return this.loginService.autoLogin();
          } else {
            return of(isAuthenticated);
          }
        }),
        withLatestFrom(this.loginService.isEmailVerified)
      )
      .pipe(
        take(1),
        map((verify) => {
          const isAuthenticated = verify[0];
          const isVerified = verify[1];
          if (!isAuthenticated) {
            //isAuthenticated
            this.router.navigateByUrl('/login');
          } else if (!isVerified) {
            //isEmailVerified
            this.router.navigateByUrl('/login');
          } else {
            return isAuthenticated;
          }
        })
      );
  }
}
