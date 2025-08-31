import { Routes } from '@angular/router';
import { authGuard } from './features/auth/guards/auth.guard';
import { adminGuard } from './features/auth/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/todos',
    pathMatch: 'full',
  },
  {
    path: 'todos',
    canActivate: [authGuard],
    loadChildren: () => import('./features/todos/todos.routes').then(m => m.TODOS_ROUTES),
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
  },
];
