import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { map, Observable, take } from "rxjs";
import { AuthService } from "./auth.service";


@Injectable({providedIn: 'root'})

export class AuthGuard implements CanActivate {
  constructor(private authService : AuthService, private router: Router){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    /* This guard will check if we have a value in our user observable. If yes then the user is logged in and can continue. */
    let url: string = state.url
    return this.authService.user$.pipe(
      take(1),
      map(user => {
          const isAuth = !!user;
          if(isAuth) {
              return true;
          }

          // else store the attempted URL for redirect and then redirect to login
          this.authService.redirectUrl = url;
          return this.router.parseUrl('/login');
      })
    )
  }

}
// export const authGuard: CanMatchFn|CanActivateFn|CanActivateChildFn =  () => {
//   const authService = inject(AuthService)
//   const router = inject(Router)

//   if(authService.isLoggedIn){ 
//     return true
//   }

//   return router.parseUrl('/login')
// }