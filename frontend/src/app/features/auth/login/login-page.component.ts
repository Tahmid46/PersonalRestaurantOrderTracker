import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="auth-card">
      <p class="eyebrow">Sign In</p>
      <h2>Welcome back</h2>
      <p class="auth-copy">Use your email and password to access your restaurant log.</p>

      <form [formGroup]="form" (ngSubmit)="submit()" class="auth-form">
        <label>
          <span>Email</span>
          <input type="email" formControlName="email" autocomplete="email" />
        </label>

        <label>
          <span>Password</span>
          <input type="password" formControlName="password" autocomplete="current-password" />
        </label>

        <p class="auth-error" *ngIf="errorMessage()">{{ errorMessage() }}</p>

        <button type="submit" [disabled]="form.invalid || isSubmitting()">
          {{ isSubmitting() ? 'Signing in...' : 'Sign in' }}
        </button>
      </form>

      <p class="auth-footer">
        Need an account?
        <a routerLink="/register">Create one</a>
      </p>
    </section>
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