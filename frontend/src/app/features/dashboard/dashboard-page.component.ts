import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatDividerModule],
  template: `
    <mat-card appearance="outlined" class="page-card dashboard-card">
      <mat-card-content>
        <p class="eyebrow">Authenticated Area</p>
        <h2 class="section-title">Hello, {{ authService.currentUser()?.displayName }}</h2>
        <p class="section-copy">
          Authentication is active. The next phases can now build restaurant, visit, and review features on top of user-scoped access.
        </p>

        <mat-divider></mat-divider>

        <div class="stats-grid">
          <mat-card appearance="outlined" class="stat-card">
            <mat-card-header>
              <mat-card-title>Account</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>{{ authService.currentUser()?.email }}</p>
            </mat-card-content>
          </mat-card>

          <mat-card appearance="outlined" class="stat-card">
            <mat-card-header>
              <mat-card-title>Security</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>JWT bearer authentication is configured between Angular and the API.</p>
            </mat-card-content>
          </mat-card>

          <mat-card appearance="outlined" class="stat-card">
            <mat-card-header>
              <mat-card-title>Next</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>Phase 3 can add visits, restaurants, reviews, and persistence rules.</p>
            </mat-card-content>
          </mat-card>
        </div>
      </mat-card-content>
    </mat-card>
  `
})
export class DashboardPageComponent {
  protected readonly authService = inject(AuthService);
}