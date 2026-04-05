export interface AuthResponse {
  userId: string;
  displayName: string;
  email: string;
  token: string;
  expiresAtUtc: string;
}

export interface CurrentUser {
  userId: string;
  displayName: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  displayName: string;
  email: string;
  password: string;
}