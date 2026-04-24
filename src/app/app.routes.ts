import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

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
        path: 'usuarios/nuevo',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./features/users/pages/user-create-page/user-create-page.component').then(
            (module) => module.UserCreatePageComponent,
          ),
        data: {
          pageTitle: 'Usuarios',
          pageSubtitle: 'Gestiona los usuarios y sus permisos por empresa',
          roles: ['superadmin'],
        },
      },
      {
        path: 'usuarios/:id/editar',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./features/users/pages/user-edit-page/user-edit-page.component').then(
            (module) => module.UserEditPageComponent,
          ),
        data: {
          pageTitle: 'Usuarios',
          pageSubtitle: 'Edita la información principal del usuario',
          roles: ['superadmin'],
        },
      },
      {
        path: 'usuarios/:id/detalle',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./features/users/pages/user-detail-page/user-detail-page.component').then(
            (module) => module.UserDetailPageComponent,
          ),
        data: {
          pageTitle: 'Usuarios',
          pageSubtitle: 'Detalle de usuario owner',
          roles: ['superadmin'],
        },
      },
      {
        path: 'usuarios',
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./features/users/pages/users-page/users-page.component').then(
            (module) => module.UsersPageComponent,
          ),
        data: {
          pageTitle: 'Usuarios',
          pageSubtitle: 'Gestiona los usuarios y sus permisos por empresa',
          roles: ['superadmin'],
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
