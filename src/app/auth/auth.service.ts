import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, delay, Observable, of, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from './user.model';
import { AuthResponseData, AuthResponseErrors } from './auth-response.model';
import { SnackbarService } from '../snackbar/snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  /* The auth guard will store the URL (when applicable) so we can redirect after logging in */
  redirectUrl: string | null = null;

  private signUpURL: string = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='
  private loginURL: string = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='
  private apiKey: string = environment.apiKey;

  private authReqBody = {
      email: '',
      password: '',
      returnSecureToken: true
  }
  private tokenExpirationTimer: any;
  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }

  /** 
   * Instead of a Subject with no initial value on first emit, use a Behavior Subject that needs a default value
   * This way any late subscribers can still get the last emitted value.  
  */
  private userBehaviorSubject = new BehaviorSubject<User | null>(null);
  /** 
   * Instead of the get method found in recipe and ingredient service, we can also use this shorthand to have a
   * observable other components can subscribe to.
   */
  public user$ = this.userBehaviorSubject.asObservable()

  constructor(private http: HttpClient, private router: Router, private snackbar: SnackbarService) { }

  signup(email: string, password: string): Observable<AuthResponseData> {
    this.authReqBody.email = email;
    this.authReqBody.password = password;

    return this.http.post<AuthResponseData>(this.signUpURL + this.apiKey, this.authReqBody, this.httpOptions).pipe(
      catchError(this.handleError.bind(this)),
      tap(resData => this.storeUser(resData.idToken, +resData.expiresIn)),
      tap(_ => this.snackbar.show('Succesfully signed up, logging you in')),
      tap(_ => {
        if(this.redirectUrl){
          this.router.navigate([this.redirectUrl]);
          this.redirectUrl = null;
        } else { 
          this.router.navigate(['/recipes'])
        }
      })
    )
  }

  login(email: string, password: string): Observable<AuthResponseData> {
    this.authReqBody.email = email;
    this.authReqBody.password = password;

    return this.http.post<AuthResponseData>(this.loginURL + this.apiKey, this.authReqBody, this.httpOptions).pipe(
      catchError(this.handleError.bind(this)),
      tap(_ => this.snackbar.show('Succesfully logged in')),
      tap(resData => this.storeUser(resData.idToken, +resData.expiresIn)),
      tap(_ => {
        if(this.redirectUrl){
          this.router.navigate([this.redirectUrl]);
          this.redirectUrl = null;
        } else { 
          this.router.navigate(['/recipes'])
        }
      })
      
    )
  }

  /* Clears the user behavior subject, navigates to home, removes localstorage uer data, clears timer*/
  logout(type: string) : Observable<string> {
    this.userBehaviorSubject.next(null);
    this.router.navigate(['/recipes']);
    localStorage.removeItem('userData');

    if(this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer)
    }
    this.tokenExpirationTimer = null;
    if(type === 'manual') { 
      this.snackbar.show('Successfully logged out, see you next time')
    } else {
      this.snackbar.show('You have been automatically logged out, please login again','snack-error')
    }
    return of('user logged out')
  }

  /* on sign up or login we store the Firebase auth response to localstorage, updates the user behavior subject and autologout timer */
  private storeUser(token:string, expiresIn: number) : void {
    const expirationDate = new Date().getTime() + (expiresIn * 1000);
    const user = new User(
        null,
        null,
        token,
        new Date(expirationDate)
    )
    this.userBehaviorSubject.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
    this.autoLogout(expiresIn * 1000)
  }

  autoLogout(duration: number) : void {
    if(duration) {
     this.tokenExpirationTimer = setTimeout(()=>{
         this.logout('auto');
     }, duration)
    }
  }

  autoLogin() : void {
    const localStorageData = localStorage.getItem('userData')

    if(localStorageData) {
      const userData : {
          _token: string,
          _tokenExpirationDate: string
      } = JSON.parse(localStorageData);

      if(!userData) {
          return
      }

      this.userBehaviorSubject.next(new User(null, null, userData._token, new Date(userData._tokenExpirationDate)));
      const expirationDuration = (new Date(userData._tokenExpirationDate).getTime()) - (new Date().getTime());
      this.autoLogout(expirationDuration);
    }
  }

/** 
 * Instead of just a placeholder error handler, we want to use Firebase's error string codes and display a more
 * user-friendly message.  
 */
private handleError(errorRes : HttpErrorResponse) {
  if(!errorRes.error || !errorRes.error.error) {
      return throwError(()=> new Error(errorRes.message));
  }

  let errorMessage = this.findMatchingErrorType(errorRes.error.error.message)

  if(errorMessage){
    return throwError(() => new Error(errorMessage));
  } else {
    return throwError(() => new Error(`An error ocurred: ${errorRes.error.error.message}`));
  }  
}

/* We have an enum-like object/dict for the error codes and the message we want to display. This tries to find a match.  */
private findMatchingErrorType (errorKey : string) {
  const matchingKey = Object.keys(AuthResponseErrors).find(key => key === errorKey)
  if(matchingKey) return AuthResponseErrors[matchingKey]
  
  return undefined
}
}
