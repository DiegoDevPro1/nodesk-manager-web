import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { ApiResponse } from '../../../core/models/api/api-response.model';
import { User, UsersOwnersResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly usersEndpoint = 'api/users';

  constructor(private readonly apiService: ApiService) {}

  getOwners(params: { page?: number; limit?: number; search?: string }): Observable<ApiResponse<UsersOwnersResponse>> {
    return this.apiService.get<ApiResponse<UsersOwnersResponse>>(`${this.usersEndpoint}/owners`, {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        search: params.search ?? '',
      },
    });
  }

  createOwner(body: {
    name: string;
    email: string;
    password: string;
    documentType: string;
    documentNumber: string;
    phone: string;
  }): Observable<ApiResponse<User>> {
    return this.apiService.post<ApiResponse<User>, typeof body>(
      `${this.usersEndpoint}/create-owner`,
      body,
    );
  }
}
