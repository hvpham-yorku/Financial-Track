import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Budget {
  id?: number;
  category: string;
  amount: number;
  monthYear: string;
}

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private apiUrl = 'http://localhost:3000/budget'; // Adjust as necessary

  constructor(private http: HttpClient) {}

  getBudgets(): Observable<{ data: Budget[]; error: string | null }> {
    return this.http.get<{ data: Budget[]; error: string | null }>(this.apiUrl);
  }

  getBudgetById(id: number): Observable<{ data: Budget; error: string | null }> {
    return this.http.get<{ data: Budget; error: string | null }>(`${this.apiUrl}/${id}`);
  }

  addBudget(budget: Budget): Observable<{ data: Budget; error: string | null }> {
    return this.http.post<{ data: Budget; error: string | null }>(this.apiUrl, budget);
  }

  updateBudget(budget: Budget): Observable<{ error: string | null }> {
    return this.http.patch<{ error: string | null }>(`${this.apiUrl}/edit`, budget);
  }

  deleteBudget(id: number): Observable<{ error: string | null }> {
    return this.http.request<{ error: string | null }>('delete', `${this.apiUrl}/delete`, { body: { id } });
  }
}