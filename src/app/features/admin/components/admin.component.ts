import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { TodoService } from '../../todos/services/todo.service';
import { User } from '../../auth/models/user.model';
import { Todo } from '../../todos/models/todo.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Interface d'Administration</h1>
        <p class="text-gray-600 mt-2">Gérez les utilisateurs et les tickets</p>
      </div>

      <!-- Statistiques -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span class="text-white text-sm font-bold">{{ users().length }}</span>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Utilisateurs</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ users().length }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span class="text-white text-sm font-bold">{{
                    getTodosByStatus('done').length
                  }}</span>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Tickets terminés</dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ getTodosByStatus('done').length }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <span class="text-white text-sm font-bold">{{
                    getTodosByStatus('in-progress').length
                  }}</span>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">En cours</dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ getTodosByStatus('in-progress').length }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                  <span class="text-white text-sm font-bold">{{
                    getTodosByStatus('todo').length
                  }}</span>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">À faire</dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ getTodosByStatus('todo').length }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Admin -->
      <div class="mb-8">
        <nav class="flex space-x-4">
          <button
            (click)="activeTab.set('users')"
            [class.bg-blue-600]="activeTab() === 'users'"
            [class.text-white]="activeTab() === 'users'"
            [class.text-gray-700]="activeTab() !== 'users'"
            class="px-4 py-2 rounded-md font-medium hover:bg-blue-700 hover:text-white transition-colors"
          >
            Utilisateurs
          </button>
          <button
            (click)="activeTab.set('tickets')"
            [class.bg-blue-600]="activeTab() === 'tickets'"
            [class.text-white]="activeTab() === 'tickets'"
            [class.text-gray-700]="activeTab() !== 'tickets'"
            class="px-4 py-2 rounded-md font-medium hover:bg-blue-700 hover:text-white transition-colors"
          >
            Tickets
          </button>
        </nav>
      </div>

      <!-- Contenu des onglets -->
      @if (activeTab() === 'users') {
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">Gestion des Utilisateurs</h2>
          </div>
          <div class="p-6">
            @if (users().length > 0) {
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Utilisateur
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Rôle
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    @for (user of users(); track user.id) {
                      <tr>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center">
                            <div class="flex-shrink-0 h-10 w-10">
                              <div
                                class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center"
                              >
                                <span class="text-sm font-medium text-gray-700">
                                  {{ user.name.charAt(0).toUpperCase() }}
                                </span>
                              </div>
                            </div>
                            <div class="ml-4">
                              <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                              <div class="text-sm text-gray-500">{{ user.email }}</div>
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <select
                            [value]="user.role"
                            (change)="onUserRoleChange(user.id, $event)"
                            [disabled]="user.id === getCurrentUser()?.id"
                            class="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          @if (user.id !== getCurrentUser()?.id) {
                            <button
                              (click)="deleteUser(user.id)"
                              class="text-red-600 hover:text-red-900"
                            >
                              Supprimer
                            </button>
                          } @else {
                            <span class="text-gray-400">Vous</span>
                          }
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            } @else {
              <p class="text-gray-500 text-center py-8">Aucun utilisateur trouvé</p>
            }
          </div>
        </div>
      }

      @if (activeTab() === 'tickets') {
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">Gestion des Tickets</h2>
          </div>
          <div class="p-6">
            @if (todos().length > 0) {
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Ticket
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Statut
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Priorité
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Assigné à
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    @for (todo of todos(); track todo.id) {
                      <tr>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm font-medium text-gray-900">{{ todo.title }}</div>
                          @if (todo.description) {
                            <div class="text-sm text-gray-500">{{ todo.description }}</div>
                          }
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <select
                            [value]="todo.status"
                            (change)="onTodoStatusChange(todo.id, $event)"
                            class="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="todo">À faire</option>
                            <option value="in-progress">En cours</option>
                            <option value="done">Terminé</option>
                          </select>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <select
                            [value]="todo.priority"
                            (change)="onTodoPriorityChange(todo.id, $event)"
                            class="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="low">Faible</option>
                            <option value="medium">Moyenne</option>
                            <option value="high">Haute</option>
                          </select>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <select
                            [value]="todo.assignedTo || ''"
                            (change)="onTodoAssignChange(todo.id, $event)"
                            class="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Non assigné</option>
                            @for (user of users(); track user.id) {
                              <option [value]="user.id">{{ user.name }}</option>
                            }
                          </select>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            (click)="deleteTodo(todo.id)"
                            class="text-red-600 hover:text-red-900"
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            } @else {
              <p class="text-gray-500 text-center py-8">Aucun ticket trouvé</p>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class AdminComponent implements OnInit {
  private authService = inject(AuthService);
  private todoService = inject(TodoService);
  private router = inject(Router);

  activeTab = signal<'users' | 'tickets'>('users');
  users = signal<User[]>([]);
  todos = signal<Todo[]>([]);

  async ngOnInit() {
    // Vérifier que l'utilisateur est admin
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      this.router.navigate(['/todos']);
      return;
    }

    // Charger les données
    await this.loadUsers();
    await this.loadTodos();
  }

  async loadUsers() {
    try {
      this.authService.getAllUsers().subscribe({
        next: (users: User[]) => this.users.set(users),
        error: (error: Error) =>
          console.error('Erreur lors du chargement des utilisateurs:', error),
      });
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    }
  }

  async loadTodos() {
    try {
      const todos = await this.todoService.getAllTodos();
      this.todos.set(todos);
    } catch (error) {
      console.error('Erreur lors du chargement des todos:', error);
    }
  }

  async deleteUser(userId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        this.authService.deleteUser(userId).subscribe({
          next: () => this.loadUsers(),
          error: (error: Error) => console.error('Erreur lors de la suppression:', error),
        });
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  }

  async deleteTodo(todoId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce ticket ?')) {
      try {
        await this.todoService.deleteTodo(todoId);
        await this.loadTodos();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  }

  async updateUserRole(userId: number, newRole: 'user' | 'admin') {
    try {
      this.authService.updateUserRole(userId, newRole).subscribe({
        next: () => this.loadUsers(),
        error: (error: Error) => console.error('Erreur lors du changement de rôle:', error),
      });
    } catch (error) {
      console.error('Erreur lors du changement de rôle:', error);
    }
  }

  onUserRoleChange(userId: number, event: Event) {
    const target = event.target as HTMLSelectElement;
    const newRole = target.value as 'user' | 'admin';
    this.updateUserRole(userId, newRole);
  }

  onTodoStatusChange(todoId: number, event: Event) {
    const target = event.target as HTMLSelectElement;
    const newStatus = target.value as Todo['status'];
    this.updateTodoStatus(todoId, newStatus);
  }

  onTodoPriorityChange(todoId: number, event: Event) {
    const target = event.target as HTMLSelectElement;
    const newPriority = target.value as Todo['priority'];
    this.updateTodoPriority(todoId, newPriority);
  }

  onTodoAssignChange(todoId: number, event: Event) {
    const target = event.target as HTMLSelectElement;
    const userId = target.value;
    this.assignTodo(todoId, userId);
  }

  async updateTodoStatus(todoId: number, newStatus: Todo['status']) {
    try {
      await this.todoService.updateTodo(todoId, { status: newStatus });
      await this.loadTodos();
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
    }
  }

  async updateTodoPriority(todoId: number, newPriority: Todo['priority']) {
    try {
      await this.todoService.updateTodo(todoId, { priority: newPriority });
      await this.loadTodos();
    } catch (error) {
      console.error('Erreur lors du changement de priorité:', error);
    }
  }

  async assignTodo(todoId: number, userId: string) {
    try {
      const assignedTo = userId ? parseInt(userId, 10) : undefined;
      await this.todoService.updateTodo(todoId, { assignedTo });
      await this.loadTodos();
    } catch (error) {
      console.error("Erreur lors de l'attribution:", error);
    }
  }

  // Méthodes utilitaires
  getCurrentUser(): User | null {
    return this.authService.getCurrentUser();
  }

  getTodosByStatus(status: Todo['status']): Todo[] {
    return this.todos().filter(todo => todo.status === status);
  }
}
