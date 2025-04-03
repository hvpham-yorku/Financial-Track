import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:3000';
  public tab: any;
  public selectedWeeklyDate:any;
  public selectedMonthlyDate:any;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  addTransaction(formData?: any) {
    const token = localStorage.getItem('jwt_token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<any>(`${this.baseUrl}/transactions/add`, formData, {
      headers,
    });
  }

  updateTransaction(formData: any) {
    const token = localStorage.getItem('jwt_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.patch<any>(`${this.baseUrl}/transactions/edit`, formData, {
      headers,
    });
  }

  deleteTransaction(id: number) {
    const token = localStorage.getItem('jwt_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<any>(`${this.baseUrl}/transactions/delete`, {
      headers,
      body: { id },
    });
  }

  getTransactions() {
    const token = localStorage.getItem('jwt_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(`${this.baseUrl}/transactions/all-split`, {
      headers,
    });
  }

  getTransactionsByMonth(date : any) {
    const token = localStorage.getItem('jwt_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(`${this.baseUrl}/transactions/month/${date}`, {
      headers,
    });
  }

  getTransactionsByWeek(date : any) {
    const token = localStorage.getItem('jwt_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(`${this.baseUrl}/transactions/week/${date}`, {
      headers,
    });
  }

  getProfile() {
    const token = localStorage.getItem('jwt_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http
      .get<{ data: any; error: string | null }>(`${this.baseUrl}/users`, {
        headers,
      })
      .pipe(
        map((response) => {
          if (token) {
            try {
              const payloadBase64 = token.split('.')[1];
              const payload = JSON.parse(atob(payloadBase64));
              const userId = payload.id;

              if (Array.isArray(response)) {
                const currentUser = response.find(
                  (user: any) => user.id === userId
                );
                return {
                  data: currentUser || null,
                  error: currentUser ? null : 'User not found',
                };
              } else if (Array.isArray(response.data)) {
                const currentUser = response.data.find(
                  (user: any) => user.id === userId
                );
                return {
                  data: currentUser || null,
                  error: currentUser ? null : 'User not found',
                };
              }
            } catch (error) {
              console.error('Error decoding JWT token:', error);
            }
          }
          return response;
        }),
        catchError((error) => {
          console.error('Error fetching user profile:', error);
          return of({ data: null, error: 'Failed to load user profile' });
        })
      );
  }
}
