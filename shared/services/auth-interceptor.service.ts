import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Observable } from 'rxjs';
import {  switchMap, take } from 'rxjs/operators';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private loginService: LoginService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(req.url.indexOf('/login') || req.url.indexOf('/register')){
      if(!req.url.indexOf('verifyEmail') && !req.url.indexOf('resendVerifyCode')){
        return next.handle(req);
      }
    }
    return this.loginService.user.pipe(take(1),switchMap( user =>{

      if(user?.token){
        const modifiedRequest = req.clone({headers: req.headers.append('Authorization', `Bearer ${user.token}`)});
        return next.handle(modifiedRequest);
      } else{
        return next.handle(req);
      }
    }));
  }
}
