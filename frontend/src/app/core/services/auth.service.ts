import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, of, tap } from 'rxjs';
import { apiConfig } from '../config/api.config';
import { AuthResponse, CurrentUser, LoginRequest, RegisterRequest } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly tokenStorageKey = 'restaurant-order-tracker.auth-token';
  private readonly currentUserState = signal<CurrentUser | null>(null);

  readonly currentUser = this.currentUserState.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserState() !== null && this.hasToken());

  restoreSession(): void {
    if (!this.hasToken()) {
      this.currentUserState.set(null);
      return;
    }

    this.fetchCurrentUser().subscribe();
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${apiConfig.baseUrl}/auth/register`, request).pipe(
      tap((response) => this.applyAuthResponse(response))
    );
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${apiConfig.baseUrl}/auth/login`, request).pipe(
      tap((response) => this.applyAuthResponse(response))
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenStorageKey);
    this.currentUserState.set(null);
    void this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenStorageKey);
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  fetchCurrentUser(): Observable<CurrentUser | null> {
    if (!this.hasToken()) {
      this.currentUserState.set(null);
      return of(null);
    }

    return this.http.get<CurrentUser>(`${apiConfig.baseUrl}/auth/me`).pipe(
      tap((user) => this.currentUserState.set(user)),
      catchError(() => {
        localStorage.removeItem(this.tokenStorageKey);
        this.currentUserState.set(null);
        return of(null);
      })
    );
  }

  private applyAuthResponse(response: AuthResponse): void {
    localStorage.setItem(this.tokenStorageKey, response.token);
    this.currentUserState.set({
      userId: response.userId,
      displayName: response.displayName,
      email: response.email
    });
  }
}