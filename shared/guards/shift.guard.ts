import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, of} from 'rxjs';
import {ShiftService} from "../services/shift.service";
import {switchMap} from "rxjs/operators";
import {LoginService} from "../services/login.service";

@Injectable({
  providedIn: 'root'
})
export class ShiftGuard implements CanActivate {
  constructor(private shiftService: ShiftService,
              private loginService: LoginService,
              private router: Router) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.shiftService
      .getCurrentShift()
      .pipe(switchMap( shift => {
        let today = new Date();
        if (!shift || new Date(shift.date).toDateString() != today.toDateString() ) {
          this.loginService.logout();
          return of(false);
        }
        return of(!!shift);
      }))
  }

}
