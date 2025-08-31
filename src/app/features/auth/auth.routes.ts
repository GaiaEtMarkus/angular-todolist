import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    // TODO: Ajouter LoginComponent dans la Partie 2
    redirectTo: '/todos',
  },
  {
    path: 'register',
    // TODO: Ajouter RegisterComponent dans la Partie 2
    redirectTo: '/todos',
  },
];
