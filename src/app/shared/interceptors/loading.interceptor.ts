import { HttpRequest, HttpHandlerFn, HttpResponse } from '@angular/common/http';
import { finalize, tap } from 'rxjs/operators';

// Service global pour gérer les requêtes actives
class LoadingService {
  private activeRequests = 0;

  increment() {
    this.activeRequests++;
    if (this.activeRequests === 1) {
      console.warn('🌐 Intercepteur Loading: Affichage du loading global');
    }
  }

  decrement() {
    this.activeRequests--;
    if (this.activeRequests === 0) {
      console.warn('🌐 Intercepteur Loading: Masquage du loading global');
    }
  }

  hasActiveRequests(): boolean {
    return this.activeRequests > 0;
  }
}

const loadingService = new LoadingService();

export function loadingInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {
  // Incrémenter le compteur de requêtes actives
  loadingService.increment();
  
  // Logger le début de la requête
  console.warn(`🔄 Intercepteur Loading: Début requête ${request.method} ${request.url}`);
  
  const startTime = Date.now();

  return next(request).pipe(
    tap((event) => {
      // Logger la réponse réussie
      if (event instanceof HttpResponse) {
        const duration = Date.now() - startTime;
        console.warn(`✅ Intercepteur Loading: Réponse ${request.method} ${request.url} (${duration}ms)`);
      }
    }),
    finalize(() => {
      // Décrémenter le compteur de requêtes actives
      loadingService.decrement();
      
      // Logger la fin de la requête
      console.warn(`🏁 Intercepteur Loading: Fin requête ${request.method} ${request.url}`);
    })
  );
} 