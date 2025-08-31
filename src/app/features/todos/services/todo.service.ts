import { Injectable, signal, computed, effect } from '@angular/core';
import { Todo, CreateTodoRequest } from '../models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  // Signal principal - données source
  private todos = signal<Todo[]>([
    {
      id: 1,
      title: 'Apprendre Angular',
      description: "Étudier les fondamentaux d'Angular 20+",
      status: 'todo',
      priority: 'high',
      createdBy: 1,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: 2,
      title: 'Créer un projet',
      description: 'Développer une application TodoList',
      status: 'in-progress',
      priority: 'medium',
      createdBy: 1,
      createdAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-16'),
    },
    {
      id: 3,
      title: "Configurer l'environnement",
      description: 'Installer Node.js, Angular CLI et configurer VS Code',
      status: 'done',
      priority: 'high',
      createdBy: 1,
      createdAt: new Date('2024-01-13'),
      updatedAt: new Date('2024-01-14'),
    },
  ]);

  // Signals computed - données dérivées (se recalculent automatiquement)
  public completedTodos = computed(() => this.todos().filter(todo => todo.status === 'done'));

  public pendingTodos = computed(() => this.todos().filter(todo => todo.status === 'todo'));

  public inProgressTodos = computed(() =>
    this.todos().filter(todo => todo.status === 'in-progress')
  );

  public highPriorityTodos = computed(() => this.todos().filter(todo => todo.priority === 'high'));

  public todoStats = computed(() => {
    const todos = this.todos();
    const completed = this.completedTodos().length;
    const total = todos.length;

    return {
      total,
      completed,
      pending: total - completed,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      highPriority: this.highPriorityTodos().length,
      inProgress: todos.filter(todo => todo.status === 'in-progress').length,
    };
  });

  // Signal readonly pour l'accès externe
  public todos$ = this.todos.asReadonly();

  constructor() {
    // Effet - se déclenche automatiquement quand les todos changent
    effect(() => {
      const todos = this.todos();
      const stats = this.todoStats();

      console.warn('📊 TodoService - Effect déclenché:');
      console.warn(`   - Total todos: ${stats.total}`);
      console.warn(`   - Complétés: ${stats.completed} (${stats.completionRate}%)`);
      console.warn(`   - En cours: ${stats.inProgress}`);
      console.warn(`   - Priorité haute: ${stats.highPriority}`);

      // Sauvegarder dans localStorage
      localStorage.setItem('todos', JSON.stringify(todos));
      console.warn('💾 Todos sauvegardés dans localStorage');
    });
  }

  // Simuler un délai réseau
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // GET - Récupérer tous les todos
  async getAllTodos(): Promise<Todo[]> {
    console.warn('🔄 Service: Récupération de tous les todos...');
    await this.delay(300);
    console.warn('✅ Service: Todos récupérés avec succès');
    return this.todos();
  }

  // GET - Récupérer un todo par ID
  async getTodoById(id: number): Promise<Todo | undefined> {
    console.warn(`🔄 Service: Récupération du todo ${id}...`);
    await this.delay(200);
    const todo = this.todos().find(t => t.id === id);
    console.warn(`✅ Service: Todo ${id} récupéré:`, todo);
    return todo;
  }

  // POST - Créer un nouveau todo
  async createTodo(todoData: CreateTodoRequest): Promise<Todo> {
    console.warn("🔄 Service: Création d'un nouveau todo...", todoData);
    await this.delay(400);

    const newTodo: Todo = {
      id: Date.now(),
      title: todoData.title,
      description: todoData.description || '',
      status: 'todo',
      priority: todoData.priority,
      assignedTo: todoData.assignedTo,
      createdBy: 1, // TODO: Récupérer l'ID de l'utilisateur connecté
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Mise à jour du signal - déclenche automatiquement les computed et effects
    this.todos.update(todos => [...todos, newTodo]);
    console.warn('✅ Service: Todo créé avec succès:', newTodo);
    return newTodo;
  }

  // PUT - Mettre à jour un todo
  async updateTodo(id: number, updates: Partial<Todo>): Promise<Todo | undefined> {
    console.warn(`🔄 Service: Mise à jour du todo ${id}...`, updates);
    await this.delay(300);

    let updatedTodo: Todo | undefined;
    this.todos.update(todos =>
      todos.map(todo => {
        if (todo.id === id) {
          updatedTodo = {
            ...todo,
            ...updates,
            updatedAt: new Date(),
          };
          return updatedTodo;
        }
        return todo;
      })
    );

    console.warn(`✅ Service: Todo ${id} mis à jour:`, updatedTodo);
    return updatedTodo;
  }

  // DELETE - Supprimer un todo
  async deleteTodo(id: number): Promise<boolean> {
    console.warn(`🔄 Service: Suppression du todo ${id}...`);
    await this.delay(250);

    let deleted = false;
    this.todos.update(todos => {
      const initialLength = todos.length;
      const filtered = todos.filter(todo => todo.id !== id);
      deleted = filtered.length < initialLength;
      return filtered;
    });

    console.warn(`✅ Service: Todo ${id} supprimé:`, deleted);
    return deleted;
  }

  // Méthodes utilitaires utilisant les computed signals
  getTodosByStatus(status: Todo['status']): Todo[] {
    if (status === 'done') return this.completedTodos();
    if (status === 'todo') return this.pendingTodos();
    if (status === 'in-progress') return this.inProgressTodos();
    return this.todos().filter(todo => todo.status === status);
  }

  getTodosByPriority(priority: Todo['priority']): Todo[] {
    if (priority === 'high') return this.highPriorityTodos();
    return this.todos().filter(todo => todo.priority === priority);
  }

  // Méthode pour obtenir les statistiques en temps réel
  getStats() {
    return this.todoStats();
  }
}
