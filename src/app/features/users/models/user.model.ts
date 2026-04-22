export type UserStatus = 'active' | 'invited' | 'suspended';

export interface UserRole {
  id: number;
  name: string;
  slug: string;
}

export interface UserCompany {
  id: number;
  name: string;
  ruc: string;
  address: string;
  phone: string;
  isActive: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  documentType: string | null;
  documentNumber: string | null;
  phone: string | null;
  role: UserRole;
  company: UserCompany | null;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UsersOwnersResponse {
  data: User[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
