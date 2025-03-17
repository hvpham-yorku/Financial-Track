import { UserService } from './../../services/user.service';
import { FormsModule } from '@angular/forms';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isRegistering: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  // Toggle between login and register modes
  toggleRegisterMode() {
    this.isRegistering = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Clear password fields when toggling
    this.password = '';
    this.confirmPassword = '';
  }

  // Handle login
  login() {
    if (this.isRegistering) {
      this.isRegistering = false;
      return;
    }

    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both username and password';
      return;
    }

    const loginData = {
      username: this.username,
      password: this.password,
    };

    this.http
      .post<{ data: string | null; error: string | null }>(
        `http://localhost:3000/auth/login`, loginData
      )
      .subscribe({
        next: (response) => {
          if (response.data) {
            localStorage.setItem('jwt_token', response.data);
            this.router.navigate(['/dashboard'], {
              queryParams: { authenticated: true },
            });
          } else if (response.error) {
            this.errorMessage = response.error;
          }
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = "Login failed. Please check your credentials.";
          console.error('Login error details:', error);
        }
      });
  }

  // Submit registration form
  submitRegistration() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both username and password';
      this.successMessage = '';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      this.successMessage = '';
      return;
    }

    console.log('Submitting registration with:', {
      username: this.username,
      password: this.password
    });

    this.register();
  }

  // Register a new user
  register() {
    this.http
      .post<{ data: string | null; error: string | null }>(
        'http://localhost:3000/auth/register',
        {
          username: this.username,
          password: this.password,
        }
      )
      .subscribe({
        next: (response) => {
          console.log('Registration response:', response);
          if (response.error) {
            this.errorMessage = response.error;
            this.successMessage = '';
          } else {
            // Registration successful, ask user to login
            console.log('Registration successful!', response.data);
            this.errorMessage = '';
            this.successMessage = 'Registration successful! Please login with your credentials.';
            // Clear the form and switch back to login mode
            this.password = '';
            this.confirmPassword = '';
            this.isRegistering = false;
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Registration error details:', error);
          if (error.status === 0) {
            this.errorMessage = 'Cannot connect to server. Please check if the server is running.';
          } else if (error.status === 400 && error.error?.error) {
            this.errorMessage = error.error.error;
          } else {
            this.errorMessage = error.error?.error || 'Server error. Please try again later.';
          }
          this.successMessage = '';
        }
      });
  }
}
