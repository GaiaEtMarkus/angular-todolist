import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.getCurrentUser();
  
  if (currentUser && currentUser.role === 'admin') {
    return true; // Utilisateur admin, accès autorisé
  }

  // Utilisateur non admin ou non connecté, redirection
  if (currentUser) {
    router.navigate(['/todos']); // Redirection vers todos si connecté mais pas admin
  } else {
    router.navigate(['/auth/login'], { 
      queryParams: { returnUrl: state.url } 
    });
  }
  
  return false;
}; 