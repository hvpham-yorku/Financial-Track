import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';

interface Budget {
  id?: number;
  amount: number;
  note: string;
  monthYear: string;
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private apiUrl = 'http://localhost:3000/budget';

  private expensesTotalSubject = new BehaviorSubject<number>(0);
  public expensesTotal$ = this.expensesTotalSubject.asObservable();

  private budgetButtonColorSubject = new BehaviorSubject<string>('');
  budgetButtonColor$ = this.budgetButtonColorSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getAllBudgets(): Observable<{ data: Budget[]; error: string | null }> {
    return this.http.get<{ data: Budget[]; error: string | null }>(
      this.apiUrl,
      { headers: this.getAuthHeaders() }
    );
  }

  getBudgetById(id: number): Observable<{ data: Budget; error: string | null }> {
    return this.http.get<{ data: Budget; error: string | null }>(
      `${this.apiUrl}/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  addBudget(budget: Budget): Observable<{ data: Budget; error: string | null }> {
    return this.http.post<{ data: Budget; error: string | null }>(
      this.apiUrl,
      budget,
      { headers: this.getAuthHeaders() }
    );
  }

  updateBudget(budget: {
    id: number;
    amount?: number;
    monthYear?: string;
    note?: string;
  }): Observable<{ error: string | null }> {
    return this.http.patch<{ error: string | null }>(
      `${this.apiUrl}/edit`,
      budget,
      { headers: this.getAuthHeaders() }
    );
  }

  updateExpensesTotal(total: number): void {
    this.expensesTotalSubject.next(total);
  }

  deleteBudget(id: number): Observable<{ error: string | null }> {
    return this.http.request<{ error: string | null }>(
      'delete',
      `${this.apiUrl}/delete`,
      {
        headers: this.getAuthHeaders(),
        body: { id }
      }
    );
  }

  updateBudgetButtonColor(color: string): void {
    this.budgetButtonColorSubject.next(color);
  }
}