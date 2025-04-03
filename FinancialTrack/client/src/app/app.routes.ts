import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { AppComponent } from './app.component';
import { TableComponent } from './components/table/table.component';
import { BudgetComponent } from './components/budget/budget.component';

export const routes: Routes = [
  {path: "", redirectTo: "/login", pathMatch: "full"},
  {path: "login", component: AuthComponent},
  {path: "dashboard", component: AppComponent},
  {path: "all-transactions", component: TableComponent},
  {path: "**", redirectTo: "/login"}
];
