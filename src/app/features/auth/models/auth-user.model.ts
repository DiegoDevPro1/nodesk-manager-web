export interface AuthRole {
  id: number;
  name: string;
  slug: string;
}

export interface AuthCompany {
  id: number;
  name: string;
  ruc: string;
  address: string;
  phone: string;
  isActive: boolean;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  role: AuthRole;
  company: AuthCompany;
}
