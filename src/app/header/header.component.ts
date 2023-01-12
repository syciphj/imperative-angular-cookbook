import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{

  constructor( private authService: AuthService){}

  @Output() darkMode = new EventEmitter<boolean>();

  isDarkMode: boolean = true;
  isLoggedIn!: boolean;
  userSub : Subscription = new Subscription;
  logoutSub : Subscription = new Subscription;
  isMobileMenuOpen: boolean = false;

  ngOnInit(): void {
    this.userSub = this.authService.user$.subscribe(res => this.isLoggedIn = !!res)
  }

  logout() {
    if(!this.isLoggedIn) return

    this.logoutSub = this.authService.logout('manual').subscribe(res => console.log(res))
  }

  openMenu(){
    this.isMobileMenuOpen = true;
  }

  closeMenu(){
    this.isMobileMenuOpen = false;
  }

  toggleDarkMode(){
    this.isDarkMode = !this.isDarkMode
    this.darkMode.emit(this.isDarkMode)
  }

  ngOnDestroy(): void {
    this.logoutSub.unsubscribe()
    this.userSub.unsubscribe()
  }
}
