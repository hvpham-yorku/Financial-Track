import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
  {path: "", redirectTo: "/login", pathMatch: "full"},
  {path: "login", component: AuthComponent},
  {path: "dashboard", component: AppComponent},
  {path: "**", redirectTo: "/login"}
];
