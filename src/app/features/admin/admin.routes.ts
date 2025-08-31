import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    // TODO: Ajouter AdminComponent dans la Partie 2
    redirectTo: '/todos',
  },
];
