import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Imperative Cookbook';

  isDarkMode : boolean = true;

  constructor(private authService: AuthService){}

  ngOnInit(){
    /* When you start the app, or on refresh, see if you can autologin the user */
    this.authService.autoLogin()
  }

  toggleDarkClass(isDark : boolean) {
    this.isDarkMode = isDark
  }
}
