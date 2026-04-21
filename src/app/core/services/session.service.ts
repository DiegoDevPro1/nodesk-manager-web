import { Injectable, computed, signal } from '@angular/core';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { AUTH_TOKEN_STORAGE_KEY } from '../constants/storage-keys';
import { AuthUser } from '../../features/auth/models/auth-user.model';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private readonly userSignal = signal<AuthUser | null>(null);

  readonly user = computed(() => this.userSignal());
  readonly isAuthenticated = computed(() => !!this.userSignal());

  setSession(user: AuthUser, token: string): void {
    this.userSignal.set(user);
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  }

  setUser(user: AuthUser): void {
    this.userSignal.set(user);
  }

  clearSession(): void {
    this.userSignal.set(null);
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  }

  hasValidToken(): boolean {
    const token = this.getToken();

    if (!token) {
      this.clearSession();
      return false;
    }

    let payload: JwtPayload;

    try {
      payload = jwtDecode<JwtPayload>(token);
    } catch {
      this.clearSession();
      return false;
    }

    if (typeof payload.exp !== 'number') {
      this.clearSession();
      return false;
    }

    const exp = payload.exp;
    const nowInSeconds = Math.floor(Date.now() / 1000);

    if (exp <= nowInSeconds) {
      this.clearSession();
      return false;
    }

    return true;
  }
}
