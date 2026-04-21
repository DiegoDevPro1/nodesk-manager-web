import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth/login',
  },
  {
    path: 'app',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/layout/pages/app-layout/app-layout.component').then(
        (module) => module.AppLayoutComponent,
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard-page/dashboard-page.component').then(
            (module) => module.DashboardPageComponent,
          ),
        data: {
          pageTitle: 'Dashboard',
          pageSubtitle: 'Resumen general de tu operacion en Nodesk Manager',
        },
      },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./features/users/pages/users-page/users-page.component').then(
            (module) => module.UsersPageComponent,
          ),
        data: {
          pageTitle: 'Usuarios',
          pageSubtitle: 'Gestiona los usuarios y sus permisos por empresa',
        },
      },
    ],
  },
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./features/auth/pages/login-page/login-page.component').then(
        (module) => module.LoginPageComponent,
      ),
  },
  {
    path: '**',
    redirectTo: 'app',
  },
];
