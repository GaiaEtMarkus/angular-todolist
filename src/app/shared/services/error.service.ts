import { Injectable, signal } from '@angular/core';

export interface ErrorNotification {
  id: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  timestamp: Date;
}

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private errors = signal<ErrorNotification[]>([]);
  public errors$ = this.errors.asReadonly();

  showError(message: string): void {
    const error: ErrorNotification = {
      id: this.generateId(),
      message,
      type: 'error',
      timestamp: new Date(),
    };

    this.errors.update(errors => [...errors, error]);

    // Auto-remove après 5 secondes
    setTimeout(() => {
      this.removeError(error.id);
    }, 5000);

    console.error('🚨 ErrorService:', message);
  }

  showWarning(message: string): void {
    const warning: ErrorNotification = {
      id: this.generateId(),
      message,
      type: 'warning',
      timestamp: new Date(),
    };

    this.errors.update(errors => [...errors, warning]);

    // Auto-remove après 3 secondes
    setTimeout(() => {
      this.removeError(warning.id);
    }, 3000);

    console.warn('⚠️ ErrorService:', message);
  }

  showInfo(message: string): void {
    const info: ErrorNotification = {
      id: this.generateId(),
      message,
      type: 'info',
      timestamp: new Date(),
    };

    this.errors.update(errors => [...errors, info]);

    // Auto-remove après 2 secondes
    setTimeout(() => {
      this.removeError(info.id);
    }, 2000);

    console.warn('ℹ️ ErrorService:', message);
  }

  removeError(id: string): void {
    this.errors.update(errors => errors.filter(error => error.id !== id));
  }

  clearAll(): void {
    this.errors.set([]);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Méthodes utilitaires pour les erreurs HTTP courantes
  handleHttpError(status: number, message?: string): void {
    switch (status) {
      case 400:
        this.showError(message || 'Requête invalide');
        break;
      case 401:
        this.showError('Session expirée. Veuillez vous reconnecter.');
        break;
      case 403:
        this.showError("Accès refusé. Vous n'avez pas les permissions nécessaires.");
        break;
      case 404:
        this.showError('Ressource non trouvée');
        break;
      case 500:
        this.showError('Erreur serveur. Veuillez réessayer plus tard.');
        break;
      default:
        this.showError(message || `Erreur ${status}: Une erreur inattendue s'est produite.`);
    }
  }
}
