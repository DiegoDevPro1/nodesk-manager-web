import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { SessionService } from '../services/session.service';
import { AuthService } from '../../features/auth/services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const sessionService = inject(SessionService);
  const authService = inject(AuthService);

  const rolesData = route.data?.['roles'] as string | string[] | undefined;

  if (!rolesData || (Array.isArray(rolesData) && rolesData.length === 0)) {
    return true;
  }

  const allowedRoles = Array.isArray(rolesData) ? rolesData : [rolesData];

  const redirectToDashboard = () => router.createUrlTree(['/app/dashboard']);

  const currentUser = sessionService.user();

  if (currentUser) {
    const userRoleSlug = currentUser.role?.slug;

    if (userRoleSlug && allowedRoles.includes(userRoleSlug)) {
      return true;
    }

    return redirectToDashboard();
  }

  if (!sessionService.hasValidToken()) {
    return router.createUrlTree(['/auth/login'], {
      queryParams: state.url && state.url !== '/auth/login' ? { returnUrl: state.url } : undefined,
    });
  }

  return authService.getCurrentUser().pipe(
    map((response) => {
      sessionService.setUser(response.data);

      const userRoleSlug = response.data.role?.slug;

      if (userRoleSlug && allowedRoles.includes(userRoleSlug)) {
        return true;
      }

      return redirectToDashboard();
    }),
    catchError(() => {
      sessionService.clearSession();

      return of(
        router.createUrlTree(['/auth/login'], {
          queryParams:
            state.url && state.url !== '/auth/login' ? { returnUrl: state.url } : undefined,
        }),
      );
    }),
  );
};
