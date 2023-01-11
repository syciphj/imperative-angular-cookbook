import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { exhaustMap, Observable, take } from "rxjs";
import { AuthService } from "./auth.service";


@Injectable()
export class AuthInterceptorService implements HttpInterceptor{
  constructor(private authService: AuthService){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    /**
     * This sample interceptor adds the auth param (when available) to all http requests. 
    */
    return this.authService.user$.pipe(
      take(1),
      exhaustMap(user => {
        if(!user) {
          return next.handle(req);
        }
        let modifiedReq = req.clone();
        if(user && user.token) {
          modifiedReq = req.clone({
             params: new HttpParams().set('auth', user.token)
         })
        }
        return next.handle(modifiedReq);
      })
    )
  }
}