import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { NotificationsComponent } from './shared/components/notifications/notifications.component';
import { PwaPromptComponent } from './shared/components/pwa-prompt/pwa-prompt.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, NotificationsComponent, PwaPromptComponent],
  template: `
    <app-header />
    <main>
      <router-outlet />
    </main>
    <app-notifications />
    <app-pwa-prompt />
  `,
  styles: [],
})
export class AppComponent {
  title = 'angular-todolist';
}
