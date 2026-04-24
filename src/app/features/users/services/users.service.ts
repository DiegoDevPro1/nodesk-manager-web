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

  getOwners(params: {
    page?: number;
    limit?: number;
    search?: string;
  }): Observable<ApiResponse<UsersOwnersResponse>> {
    return this.apiService.get<ApiResponse<UsersOwnersResponse>>(`${this.usersEndpoint}/owners`, {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        search: params.search ?? '',
      },
    });
  }

  getOwnerById(id: number): Observable<ApiResponse<User>> {
    return this.apiService.get<ApiResponse<User>>(`${this.usersEndpoint}/owners/${id}`);
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

  updateUser(
    id: number,
    body: {
      name: string;
      email: string;
      documentType: string;
      documentNumber: string;
      phone: string;
      isActive: boolean;
    },
  ): Observable<ApiResponse<User>> {
    return this.apiService.patch<ApiResponse<User>, typeof body>(`${this.usersEndpoint}/${id}`, body);
  }

  updateStaffStatus(id: number, body: { isActive: boolean }): Observable<ApiResponse<User>> {
    return this.apiService.patch<ApiResponse<User>, typeof body>(
      `${this.usersEndpoint}/${id}/status`,
      body,
    );
  }
}
