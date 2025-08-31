import { HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

export function authInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Récupérer le token depuis le service d'authentification
  const token = authService.getToken();

  // Si un token existe, l'ajouter aux headers
  if (token) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Continuer avec la requête modifiée
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      // Gérer les erreurs d'authentification
      if (error.status === 401) {
        console.warn('🔐 Intercepteur: Token expiré ou invalide');
        authService.logout();
        router.navigate(['/auth/login']);
      }

      // Gérer les erreurs d'autorisation
      if (error.status === 403) {
        console.warn('🚫 Intercepteur: Accès refusé');
        router.navigate(['/todos']);
      }

      // Gérer les erreurs serveur
      if (error.status >= 500) {
        console.error('💥 Intercepteur: Erreur serveur', error);
      }

      // Propager l'erreur
      return throwError(() => error);
    })
  );
} 