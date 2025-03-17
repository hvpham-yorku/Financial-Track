import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  addUser(user: User): Observable<User> {
    console.warn('This method is deprecated. Use auth/register endpoint instead.');
    return this.http.post<User>(`${this.baseUrl}/users`, user);
  }

  addTransaction(formData?: any) {
    const token = 'jwt-token';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(
      `${this.baseUrl}/transactions/add`,
      formData,
      { headers }
    );
  }

  getProfile() {
    const token = localStorage.getItem('jwt_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<{ data: any, error: string | null }>(`${this.baseUrl}/users`, { headers })
      .pipe(
        catchError(error => {
          console.error('Error fetching user profile:', error);
          return of({ data: null, error: 'Failed to load user profile' });
        })
      );
  }
}
