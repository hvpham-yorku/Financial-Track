import { UpdateBudget } from './../../../../../server/src/models/Budget';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BudgetService } from '../../services/budget.service';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Subscription } from 'rxjs';

interface Budget {
  id?: number;
  note: string;
  amount: number;
  monthYear: string;
}

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    CalendarModule,
    InputNumberModule,
    DropdownModule,
    ButtonModule,
    CardModule,
  ],
  standalone: true,
})
export class BudgetComponent implements OnInit {
  budgets: Budget[] = [];
  totalBudget: number = 0;
  totalExpenses: number = 0;
  remainingBalance: number = 0;
  monthYear: Date = new Date();
  newExpenseAmount: number = 0;
  currentDate: Date = new Date();
  showExpenses: boolean = true;
  private expenseSubscription: Subscription | undefined;

  expenseCategories = [
    { name: 'Groceries', icon: 'pi pi-shopping-cart' },
    { name: 'Entertainment', icon: 'pi pi-ticket' },
    { name: 'Bills', icon: 'pi pi-file' },
    { name: 'Transportation', icon: 'pi pi-car' },
    { name: 'Dining Out', icon: 'pi pi-utensils' },
    { name: 'Healthcare', icon: 'pi pi-heart' },
    { name: 'Shopping', icon: 'pi pi-shopping-bag' },
    { name: 'Other', icon: 'pi pi-ellipsis-h' },
  ];

  newExpenseCategory: any;

  constructor(private budgetService: BudgetService) {}

  ngOnInit() {
    this.loadBudgets();

    this.expenseSubscription =this.budgetService.expensesTotal$.subscribe((total) => {
    this.totalExpenses = total;
    this.calculateTotals();
    this.updateBudgetButtonColor();

//this.remainingBalance = this.totalBudget - this.totalExpenses;

    });
  }

  ngOnDestroy() {
    if (this.expenseSubscription) {
      this.expenseSubscription.unsubscribe();
    }
  }


  loadBudgets() {
    this.budgetService.getAllBudgets().subscribe(response => {
      if (!response.error) {
        this.budgets = response.data;
        this.calculateTotals();
        this.updateBudgetButtonColor();
      }
    });
  }

  addBudget(category: string, amount: number) {
    if (!category || amount <= 0) return;

    const newBudget: Budget = {
      note: category,
      amount,
      monthYear: this.formatMonthYear(this.monthYear),
    };

    this.budgetService.addBudget(newBudget).subscribe((response) => {
      if (!response.error) {
        this.budgets.push(response.data);
        this.calculateTotals();
        this.updateBudgetButtonColor();
        this.newExpenseCategory = null;
        this.newExpenseAmount = 0;
      }
    });
  }

  updateBudget(budget: Budget) {
    if (!budget.id) return;

    this.budgetService
      .updateBudget({
        id: budget.id,
        amount: budget.amount,
        note: budget.note,
        monthYear: budget.monthYear,
      })
      .subscribe(() => {
        this.loadBudgets();
      });
  }

  deleteBudget(id: number | undefined): void {
    if (id === undefined) return;

    this.budgetService.deleteBudget(id).subscribe((response) => {
      if (!response.error) {
        this.budgets = this.budgets.filter((b) => b.id !== id);
        this.calculateTotals();
        this.updateBudgetButtonColor();
      }
    });
  }

  calculateTotals() {
    this.totalBudget = this.budgets.reduce((sum, b) => sum + b.amount, 0);
    this.remainingBalance = this.totalBudget - this.totalExpenses;
  }

  updateBudgetButtonColor() {
    const budgetRatio = this.totalBudget > 0 ? (this.totalExpenses / this.totalBudget) : -1;

    let buttonColor = '';

    if(budgetRatio >= 0) {
      if(budgetRatio < 0.5) {
        buttonColor = '#4caf50';
      } else if(budgetRatio >= 0.5 && budgetRatio <= 0.75) {
        buttonColor = '#ffc107';
      } else if(budgetRatio > 0.75) {
        buttonColor = '#f44336';
      }

      this.budgetService.updateBudgetButtonColor(buttonColor);
    } else {
      this.budgetService.updateBudgetButtonColor('');
    }
  }

  private formatMonthYear(date: Date): string {
    return date.toISOString().slice(0, 7);
  }

  Save(){
    window.location.reload();
  }
}
