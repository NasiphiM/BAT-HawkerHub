import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';
import { UserModel } from '../models/user-model';
import { environment } from 'src/environments/environment';
import {ShiftService} from "./shift.service";
import {Preferences} from "@capacitor/preferences";
import {Router} from "@angular/router";
@Injectable({
  providedIn: 'root',
})
export class LoginService implements OnDestroy {
  private userPrivate = new BehaviorSubject<UserModel>(null);
  private activeLogoutTimer: any;

  constructor(
    private http: HttpClient,
    private shiftService: ShiftService,
    private router: Router
    ) {}

  get isAuthenticated(): Observable<boolean> {
    return this.user.pipe(
      map((user) => {
        if (user) {
          return !!user.token;
        } else {
          return false;
        }
      })
    );
  }

  get isEmailVerified(): Observable<boolean> {
    return this.userPrivate.pipe(
      map((user) => {
        if (user) {
          return user.emailConfirmed;
        } else {
          return false;
        }
      })
    );
  }

  get user(): Observable<UserModel> {
    return this.userPrivate.pipe(take(1));
  }

  login(email: string, password: string) {
    return this.http
      .post<UserModel>(`${environment.apiUrl}/login`, {
        userName: email,
        password,
      })
      .pipe(
        tap((resData) => {
          this.userPrivate.next(resData);
          const tokenDuration =
            new Date(resData.tokenExpiry).getTime() - new Date().getTime();
          this.autoLogout(tokenDuration);
          this.storeAuthData(resData);
        })
      );
  }

  autoLogin() {
    return from(Preferences.get({ key: 'company' })).pipe(
      map((storedData) => {
        if (!storedData || !storedData.value) {
          return null;
        }
        const parsedData = JSON.parse(storedData.value) as UserModel;

        if (new Date(parsedData.tokenExpiry) <= new Date()) {
          return null;
        }
        return parsedData;
      }),
      tap((user) => {
        if (user) {
          this.userPrivate.next(user);
          const tokenDuration =
            new Date(user.tokenExpiry).getTime() - new Date().getTime();
          this.autoLogout(tokenDuration);
        }
      }),
      map((user) => !!user)
    );
  }

  logout() {

    Preferences.remove({ key: 'company' })
      .then(() => {
        if (this.activeLogoutTimer) {
          clearTimeout(this.activeLogoutTimer);
        }
        this.userPrivate.next(null);
        this.shiftService.clearShift();
        this.router.navigate(['/login']);
        //window.location.reload();
      }, (err) =>{
        alert(err);
      }).catch(reason => {
        alert(reason);
    });
  }

  storeAuthData(userModel: UserModel) {
    Preferences.set({
      key: 'company',
      value: JSON.stringify(userModel),
    });
  }

  ngOnDestroy(): void {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }

  private autoLogout(duration: number) {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }
}
