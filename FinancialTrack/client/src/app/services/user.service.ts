import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:3000';

constructor(private http: HttpClient) { }

addUser(user: User): Observable<User> {
  return this.http.post<User>(this.apiUrl, user);
}

getProfile() {
  // Get the token from localStorage
  const token = localStorage.getItem('jwt_token');

  // Create headers with the Authorization token
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  // Make the request to get the user profile
  return this.http.get<{data: any, error: string | null}>(`${this.apiUrl}/users`, { headers })
    .pipe(
      catchError(error => {
        console.error('Error fetching user profile:', error);
        return of({data: null, error: 'Failed to load user profile'});
      })
    );
}

}
