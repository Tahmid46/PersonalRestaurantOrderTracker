import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hero-card dashboard-card">
      <p class="eyebrow">Authenticated Area</p>
      <h2>Hello, {{ authService.currentUser()?.displayName }}</h2>
      <p class="intro">
        Authentication is active. The next phases can now build restaurant, visit, and review features on top of user-scoped access.
      </p>

      <div class="status-grid">
        <article>
          <h3>Account</h3>
          <p>{{ authService.currentUser()?.email }}</p>
        </article>
        <article>
          <h3>Security</h3>
          <p>JWT bearer authentication is configured between Angular and the API.</p>
        </article>
        <article>
          <h3>Next</h3>
          <p>Phase 3 can add visits, restaurants, reviews, and persistence rules.</p>
        </article>
      </div>
    </section>
  `
})
export class DashboardPageComponent {
  protected readonly authService = inject(AuthService);
}