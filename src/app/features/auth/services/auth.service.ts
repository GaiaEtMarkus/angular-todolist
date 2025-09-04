import { Injectable, signal, inject } from '@angular/core';
import { Observable, of, throwError, delay } from 'rxjs';
import { User, LoginRequest, RegisterRequest } from '../models/user.model';
import { ErrorService } from '../../../shared/services/error.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private errorService = inject(ErrorService);

  private currentUser = signal<User | null>(null);
  public currentUser$ = this.currentUser.asReadonly();

  // Mock data - utilisateurs de test par défaut
  private defaultUsers: User[] = [
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
    },
    {
      id: 2,
      name: 'Normal User',
      email: 'user@example.com',
      role: 'user',
    },
  ];

  // Mock data - mots de passe par défaut (en réalité, ils seraient hashés)
  private defaultPasswords: Record<string, string> = {
    'admin@example.com': 'admin123',
    'user@example.com': 'user123',
  };

  private users: User[] = [];
  private passwords: Record<string, string> = {};

  constructor() {
    // Charger les utilisateurs depuis localStorage ou utiliser les défauts
    this.loadUsersFromStorage();
    
    // Vérifier s'il y a un utilisateur en session
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
    }
  }

  private loadUsersFromStorage(): void {
    const savedUsers = localStorage.getItem('allUsers');
    const savedPasswords = localStorage.getItem('userPasswords');

    if (savedUsers && savedPasswords) {
      // Charger depuis localStorage
      this.users = JSON.parse(savedUsers);
      this.passwords = JSON.parse(savedPasswords);
    } else {
      // Première fois : utiliser les données par défaut
      this.users = [...this.defaultUsers];
      this.passwords = { ...this.defaultPasswords };
      this.saveUsersToStorage();
    }
  }

  private saveUsersToStorage(): void {
    localStorage.setItem('allUsers', JSON.stringify(this.users));
    localStorage.setItem('userPasswords', JSON.stringify(this.passwords));
  }

  login(credentials: LoginRequest): Observable<User> {
    const user = this.users.find(u => u.email === credentials.email);
    const password = this.passwords[credentials.email as keyof typeof this.passwords];

    if (user && password === credentials.password) {
      // Simuler un délai réseau
      return of(user).pipe(delay(500));
    } else {
      this.errorService.showError('Email ou mot de passe incorrect');
      return throwError(() => new Error('Email ou mot de passe incorrect'));
    }
  }

  register(userData: RegisterRequest): Observable<User> {
    // Vérifier si l'email existe déjà
    const existingUser = this.users.find(u => u.email === userData.email);
    if (existingUser) {
      this.errorService.showError('Cet email est déjà utilisé');
      return throwError(() => new Error('Cet email est déjà utilisé'));
    }

    // Créer un nouvel utilisateur avec un ID unique
    const newId = Math.max(...this.users.map(u => u.id), 0) + 1;
    const newUser: User = {
      id: newId,
      name: userData.name,
      email: userData.email,
      role: 'user',
    };

    // Ajouter aux données et sauvegarder
    this.users.push(newUser);
    this.passwords[userData.email] = userData.password;
    this.saveUsersToStorage();

    this.errorService.showInfo(`Utilisateur ${userData.name} créé avec succès`);

    // Simuler un délai réseau
    return of(newUser).pipe(delay(500));
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.errorService.showInfo('Déconnexion réussie');
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  getAllUsers(): Observable<User[]> {
    return of(this.users).pipe(delay(300));
  }

  deleteUser(userId: number): Observable<void> {
    const index = this.users.findIndex(u => u.id === userId);
    if (index !== -1) {
      const userToDelete = this.users[index];
      
      // Supprimer l'utilisateur et son mot de passe
      this.users.splice(index, 1);
      delete this.passwords[userToDelete.email];
      
      // Sauvegarder les changements
      this.saveUsersToStorage();
      
      this.errorService.showInfo('Utilisateur supprimé avec succès');
      return of(void 0).pipe(delay(300));
    }
    this.errorService.showError('Utilisateur non trouvé');
    return throwError(() => new Error('Utilisateur non trouvé'));
  }

  updateUserRole(userId: number, newRole: 'user' | 'admin'): Observable<User> {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.role = newRole;
      
      // Sauvegarder les changements
      this.saveUsersToStorage();
      
      this.errorService.showInfo(`Rôle de ${user.name} changé en ${newRole}`);
      return of(user).pipe(delay(300));
    }
    this.errorService.showError('Utilisateur non trouvé');
    return throwError(() => new Error('Utilisateur non trouvé'));
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  setCurrentUser(user: User): void {
    this.currentUser.set(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    // Simuler un token JWT
    const token = `mock-jwt-token-${user.id}-${Date.now()}`;
    localStorage.setItem('authToken', token);
  }

  /**
   * Méthode utile pour réinitialiser toutes les données aux valeurs par défaut
   * Utile pour les tests ou le développement
   */
  resetToDefaults(): void {
    this.users = [...this.defaultUsers];
    this.passwords = { ...this.defaultPasswords };
    this.saveUsersToStorage();
    this.errorService.showInfo('Données utilisateurs réinitialisées');
  }

  /**
   * Méthode pour vider complètement le localStorage des utilisateurs
   */
  clearAllUserData(): void {
    localStorage.removeItem('allUsers');
    localStorage.removeItem('userPasswords');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.currentUser.set(null);
    this.loadUsersFromStorage(); // Rechargera les données par défaut
    this.errorService.showInfo('Toutes les données utilisateurs ont été effacées');
  }
}
