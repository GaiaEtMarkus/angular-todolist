import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { NotificationsComponent } from './shared/components/notifications/notifications.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, NotificationsComponent],
  template: `
    <app-header />
    <main>
      <router-outlet />
    </main>
    <app-notifications />
  `,
  styles: [],
})
export class AppComponent {
  title = 'angular-todolist';
}
