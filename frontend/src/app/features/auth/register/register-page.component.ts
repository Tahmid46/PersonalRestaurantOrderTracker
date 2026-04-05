import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

function matchingPasswords(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  return password === confirmPassword ? null : { passwordsDoNotMatch: true };
}

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="auth-card">
      <p class="eyebrow">Create Account</p>
      <h2>Start your restaurant archive</h2>
      <p class="auth-copy">Create an account so visits, reviews, and spending stay tied to you.</p>

      <form [formGroup]="form" (ngSubmit)="submit()" class="auth-form">
        <label>
          <span>Display name</span>
          <input type="text" formControlName="displayName" autocomplete="name" />
        </label>

        <label>
          <span>Email</span>
          <input type="email" formControlName="email" autocomplete="email" />
        </label>

        <label>
          <span>Password</span>
          <input type="password" formControlName="password" autocomplete="new-password" />
        </label>

        <label>
          <span>Confirm password</span>
          <input type="password" formControlName="confirmPassword" autocomplete="new-password" />
        </label>

        <p class="auth-error" *ngIf="form.hasError('passwordsDoNotMatch') && form.touched">
          Passwords must match.
        </p>
        <p class="auth-error" *ngIf="errorMessage()">{{ errorMessage() }}</p>

        <button type="submit" [disabled]="form.invalid || isSubmitting()">
          {{ isSubmitting() ? 'Creating account...' : 'Create account' }}
        </button>
      </form>

      <p class="auth-footer">
        Already registered?
        <a routerLink="/login">Sign in</a>
      </p>
    </section>
  `
})
export class RegisterPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');

  readonly form = this.formBuilder.nonNullable.group({
    displayName: ['', [Validators.required, Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: matchingPasswords });

  submit(): void {
    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const { confirmPassword, ...request } = this.form.getRawValue();
    void confirmPassword;

    this.authService.register(request).subscribe({
      next: async () => {
        this.isSubmitting.set(false);
        await this.router.navigate(['/dashboard']);
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(this.readError(error, 'Unable to create the account.'));
      }
    });
  }

  private readError(error: HttpErrorResponse, fallback: string): string {
    const errors = error.error?.errors;
    return Array.isArray(errors) && errors.length > 0 ? errors[0] : fallback;
  }
}