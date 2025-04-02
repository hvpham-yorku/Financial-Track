import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<{ data: string | null; error: string | null }> {
    return this.http.post<{ data: string | null; error: string | null }>(
      `${this.baseUrl}/login`,
      { username, password }
    ).pipe(
      catchError(this.handleError)
    );
  }

  register(username: string, password: string): Observable<{ data: string | null; error: string | null }> {
    return this.http.post<{ data: string | null; error: string | null }>(
      `${this.baseUrl}/register`,
      { username, password }
    ).pipe(
      catchError(this.handleError)
    );
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('jwt_token');
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    if (error.status === 0) {
      errorMessage = 'Network error: Please check your connection';
    } else if (error.error?.error) {
      errorMessage = error.error.error;
    }
    return throwError(() => new Error(errorMessage));
  }
}