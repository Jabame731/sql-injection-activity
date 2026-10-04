import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Welcome } from './welcome/welcome';
import { Users } from './users/users';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: Login },
  { path: 'welcome', component: Welcome, canActivate: [authGuard] },
  { path: 'users', component: Users, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' },
];
