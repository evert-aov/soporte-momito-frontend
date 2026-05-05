import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';

interface LoginRequest {
  email: string;
  password: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface MeResponse {
  id: number;
  full_name: string;
  email: string;
  role: string | null;
}

const ADMIN_ROLES = ['super_admin'];
const SELLER_ROLES = ['vendedor', ...ADMIN_ROLES];

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<MeResponse> {
    return this.http
      .post<TokenResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(res => localStorage.setItem('access_token', res.access_token)),
        switchMap(() => this.http.get<MeResponse>(`${this.apiUrl}/auth/me`)),
        tap(me => localStorage.setItem('user_info', JSON.stringify(me))),
      );
  }

  register(data: { full_name: string; email: string; password: string }): Observable<MeResponse> {
    return this.http
      .post<TokenResponse>(`${this.apiUrl}/auth/register`, data)
      .pipe(
        tap(res => localStorage.setItem('access_token', res.access_token)),
        switchMap(() => this.http.get<MeResponse>(`${this.apiUrl}/auth/me`)),
        tap(me => localStorage.setItem('user_info', JSON.stringify(me))),
      );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_info');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getUserInfo(): MeResponse | null {
    const raw = localStorage.getItem('user_info');
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }

  getRole(): string {
    return (this.getUserInfo()?.role ?? '').trim().toLowerCase();
  }

  isAdmin(): boolean {
    return ADMIN_ROLES.includes(this.getRole());
  }

  isSellerOrAbove(): boolean {
    return SELLER_ROLES.includes(this.getRole());
  }

  isCustomer(): boolean {
    return !this.isSellerOrAbove();
  }

  getMe(): Observable<MeResponse> {
    return this.http.get<MeResponse>(`${this.apiUrl}/auth/me`);
  }
}
