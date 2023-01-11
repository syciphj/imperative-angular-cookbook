import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SnackbarService } from './snackbar.service';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.css'],
  animations: [
    trigger('state', [
      transition(':enter', [
        style({ bottom: '-1rem', transform: 'translateX(-50%) scale(0.3)'}),
        animate('200ms cubic-bezier(.17,.67,.83,.67)', style({
          transform: 'translateX(-50%) scale(1)',
          opacity: 1,
          bottom: '0.75rem'
        }))
      ]),
      transition(':leave', [
        animate('150ms cubic-bezier(0.4, 0, 1, 1)', style({
          transform: 'translateX(-50%) scale(0.3)',
          opacity: 1,
          bottom: '-5rem'
        }))
      ]),
    ])
  ]
})
export class SnackbarComponent implements OnInit, OnDestroy{
  public show: boolean = false;
  public message: string = 'This is a snackbar success message.'
  public snackClass: string = 'snack-success'

  public snackbarSubscription!: Subscription;
  
  constructor( private _snackbar: SnackbarService ){}

  ngOnInit(): void {
    /* Listen to the exposed observable from our snackbar service to get an update if we should show the snackbar */
    this.snackbarSubscription = this._snackbar.getSnackbarState().subscribe((state) => {
      if(state.snackClass) this.snackClass = state.snackClass
      this.message = state.message;
      this.show = state.show;
      setTimeout(()=>{
        this.show = false
      }, 3000)
      })
  }

  onClose() {
    this.show = false;
  }

  ngOnDestroy(): void {
    this.snackbarSubscription.unsubscribe()
  }

}
