import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { ApiResponse } from '../../../core/models/api/api-response.model';
import { SessionService } from '../../../core/services/session.service';
import { LoginRequest } from '../models/login-request.model';
import { LoginResponse } from '../models/login-response.model';
import { AuthUser } from '../models/auth-user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly authEndpoint = 'auth';

  constructor(
    private readonly apiService: ApiService,
    private readonly sessionService: SessionService,
  ) {}

  login(credentials: LoginRequest) {
    return this.apiService
      .post<LoginResponse, LoginRequest>(`${this.authEndpoint}/login`, credentials)
      .pipe(
        tap((response) =>
          this.sessionService.setSession(response.data.user, response.data.token),
        ),
      );
  }

  logout(): void {
    this.sessionService.clearSession();
  }

  getToken(): string | null {
    return this.sessionService.getToken();
  }

  getCurrentUser() {
    return this.apiService.get<ApiResponse<AuthUser>>(`${this.authEndpoint}/me`);
  }
}
