import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { SessionService } from '../services/session.service';
import { AuthService } from '../../features/auth/services/auth.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const router = inject(Router);
  const sessionService = inject(SessionService);
  const authService = inject(AuthService);

  if (!sessionService.hasValidToken()) {
    return router.createUrlTree(['/auth/login'], {
      queryParams: state.url && state.url !== '/auth/login' ? { returnUrl: state.url } : undefined,
    });
  }

  return authService.getCurrentUser().pipe(
    map((response) => {
      sessionService.setUser(response.data);
      return true;
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
