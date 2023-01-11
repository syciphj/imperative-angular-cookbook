import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";

@Injectable({providedIn: 'root'})

export class SnackbarService {

  private snackbarSubject = new Subject<any>();
  
  getSnackbarState() : Observable<any> {
    return this.snackbarSubject.asObservable()
  }

  show(message: string, snackClass?: string) {
    this.snackbarSubject.next({
      show: true,
      message,
      snackClass
    })
  }

}