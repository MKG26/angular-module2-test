import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string = '';
  isLoginMode: boolean = true;

  constructor(private authService: AuthService, private router: Router) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
    this.error = '';
  }

  onSubmit() {
    this.error = '';

    if (this.isLoginMode) {
      this.authService.login(this.email, this.password).subscribe(
        (user) => {
          if (user) {
            this.router.navigate(['/books']);
          } else {
            this.error = 'Invalid credentials';
          }
        },
        (error) => {
          this.error =
            error?.error?.error?.message || 'An error occurred during login';
        }
      );
    } else {
      this.authService.signUp(this.email, this.password).subscribe(
        (user) => {
          if (user) {
            this.router.navigate(['/books']);
          } else {
            this.error = 'Failed to create account';
          }
        },
        (error) => {
          this.error =
            error?.error?.error?.message || 'An error occurred during sign up';
        }
      );
    }
  }
}
