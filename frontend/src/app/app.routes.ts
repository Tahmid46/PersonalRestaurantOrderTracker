import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { LoginPageComponent } from './features/auth/login/login-page.component';
import { RegisterPageComponent } from './features/auth/register/register-page.component';
import { DashboardPageComponent } from './features/dashboard/dashboard-page.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    component: LoginPageComponent
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    component: RegisterPageComponent
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    component: DashboardPageComponent
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
