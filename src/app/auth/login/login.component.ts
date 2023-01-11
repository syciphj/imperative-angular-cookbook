import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  isLoading = false;
  isLoginMode : boolean = true;
  errorMessage : string = '';
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  })
  /* Simple getters for reactive form controls. You can also use typesafe reactive forms like this.loginForm.value.email */
  get email() { return this.loginForm.get('email')}
  get password() { return this.loginForm.get('password')}
  

  ngOnInit(): void {
  }

  onSubmit(){
    if(!this.loginForm.valid) return
    this.isLoading = true;
    if(this.isLoginMode){
      this.login()
    } else {
      this.signup()
    }
  }

  login() {
    if(this.email?.value && this.password?.value) {
      /**
       * We're showing a different but common use of subscribe where we also have an error property.
       * Next will be called on success, otherwise error will run. We'd like to show the user on the form
       * what made their login fail. 
       */
      this.authService.login(this.email.value, this.password.value).subscribe({
        next: res => this.isLoading = false,
        error: err => this.showErrors(err)
      })
    }
  }

  signup() {
    if(this.email?.value && this.password?.value) {
      this.authService.signup(this.email.value, this.password.value).subscribe({
        next: res => this.isLoading = false,
        error: err => this.showErrors(err)
      })
    }
  }

  showErrors(error: string){
    this.isLoading = false;
    this.errorMessage = error
  }

  hideError(){
    this.errorMessage = ''
  }

  toggleLoginMode(){
    this.isLoginMode = !this.isLoginMode
  }

  onClearForm(){
    this.loginForm.reset();
  }
}
