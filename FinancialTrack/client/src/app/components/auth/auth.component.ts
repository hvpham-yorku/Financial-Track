// src/app/auth/auth.component.ts
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './../../services/auth.service';

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
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  toggleRegisterMode() {
    this.isRegistering = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.password = '';
    this.confirmPassword = '';
  }

  login() {
    if (this.isRegistering) {
      this.isRegistering = false;
      return;
    }

    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both username and password';
      return;
    }

    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        if (response.data) {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('jwt_token', response.data);
          }
          this.errorMessage = '';
          window.location.href = '/dashboard?authenticated=true';
        } else if (response.error) {
          this.errorMessage = response.error;
        }
      },
      error: (error) => {
        this.errorMessage = error.message || "Login failed. Please check your credentials.";
      }
    });
  }

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

    this.register();
  }

  register() {
    this.authService.register(this.username, this.password).subscribe({
      next: (response) => {
        if (response.error) {
          this.errorMessage = response.error;
          this.successMessage = '';
        } else {
          this.errorMessage = '';
          this.successMessage = 'Registration successful! Please login with your credentials.';
          this.password = '';
          this.confirmPassword = '';
          this.isRegistering = false;
        }
      },
      error: (error) => {
        this.errorMessage = error.message || 'Registration failed. Please try again.';
        this.successMessage = '';
      }
    });
  }
}