import { UserRole } from './user.model';

export type UserRoleSlug = 'superadmin' | 'owner' | 'staff';

const USER_ROLE_LABELS: Record<UserRoleSlug, string> = {
  superadmin: 'Super administrador',
  owner: 'Propietario',
  staff: 'Personal',
};

export function mapUserRoleToLabel(role: UserRole | null | undefined): string {
  if (!role?.slug) {
    return 'Sin rol';
  }

  const slug = role.slug as UserRoleSlug;

  return USER_ROLE_LABELS[slug] ?? role.name ?? 'Sin rol';
}

