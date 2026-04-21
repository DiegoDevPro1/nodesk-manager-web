import { ApiResponse } from '../../../core/models/api/api-response.model';
import { AuthUser } from './auth-user.model';

export interface LoginResponseData {
  user: AuthUser;
  token: string;
}

export type LoginResponse = ApiResponse<LoginResponseData>;
