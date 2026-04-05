import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  template: `
    <mat-card appearance="outlined" class="page-card auth-card">
      <mat-card-content>
        <p class="eyebrow">Sign In</p>
        <h2 class="section-title">Welcome back</h2>
        <p class="section-copy">Use your email and password to access your restaurant log.</p>

        <mat-card appearance="outlined" class="error-card" *ngIf="errorMessage()">
          <mat-card-content>{{ errorMessage() }}</mat-card-content>
        </mat-card>

        <form [formGroup]="form" (ngSubmit)="submit()" class="form-grid">
          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" autocomplete="email" />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Password</mat-label>
            <input matInput type="password" formControlName="password" autocomplete="current-password" />
          </mat-form-field>

          <button mat-flat-button type="submit" [disabled]="form.invalid || isSubmitting()" class="submit-button">
            <mat-spinner *ngIf="isSubmitting()" diameter="18"></mat-spinner>
            <span>{{ isSubmitting() ? 'Signing in...' : 'Sign in' }}</span>
          </button>
        </form>
      </mat-card-content>

      <mat-card-actions align="end">
        <a mat-button routerLink="/register">Create one</a>
      </mat-card-actions>
    </mat-card>
  `
})
export class LoginPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');

  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  submit(): void {
    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    this.authService.login(this.form.getRawValue()).subscribe({
      next: async () => {
        this.isSubmitting.set(false);
        await this.router.navigate(['/dashboard']);
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(this.readError(error, 'Unable to sign in with those credentials.'));
      }
    });
  }

  private readError(error: HttpErrorResponse, fallback: string): string {
    const errors = error.error?.errors;
    return Array.isArray(errors) && errors.length > 0 ? errors[0] : fallback;
  }
}