import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
        <p class="eyebrow">Create Account</p>
        <h2 class="section-title">Start your restaurant archive</h2>
        <p class="section-copy">Create an account so visits, reviews, and spending stay tied to you.</p>

        <mat-card appearance="outlined" class="error-card" *ngIf="form.hasError('passwordsDoNotMatch') && form.touched">
          <mat-card-content>Passwords must match.</mat-card-content>
        </mat-card>

        <mat-card appearance="outlined" class="error-card" *ngIf="errorMessage()">
          <mat-card-content>{{ errorMessage() }}</mat-card-content>
        </mat-card>

        <form [formGroup]="form" (ngSubmit)="submit()" class="form-grid">
          <mat-form-field appearance="outline">
            <mat-label>Display name</mat-label>
            <input matInput type="text" formControlName="displayName" autocomplete="name" />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" autocomplete="email" />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Password</mat-label>
            <input matInput type="password" formControlName="password" autocomplete="new-password" />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Confirm password</mat-label>
            <input matInput type="password" formControlName="confirmPassword" autocomplete="new-password" />
          </mat-form-field>

          <button mat-flat-button type="submit" [disabled]="form.invalid || isSubmitting()" class="submit-button">
            <mat-spinner *ngIf="isSubmitting()" diameter="18"></mat-spinner>
            <span>{{ isSubmitting() ? 'Creating account...' : 'Create account' }}</span>
          </button>
        </form>
      </mat-card-content>

      <mat-card-actions align="end">
        <a mat-button routerLink="/login">Sign in</a>
      </mat-card-actions>
    </mat-card>
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