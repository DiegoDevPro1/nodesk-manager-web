import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CircleHelp,
  FileText,
  LayoutDashboard,
  LucideAngularModule,
  LogOut,
  Settings,
  ShieldUser,
  Users,
} from 'lucide-angular';
import { LayoutNavItem } from '../../models/layout-nav-item.model';
import { AuthService } from '../../../auth/services/auth.service';
import { ConfirmDialogService } from '../../../../core/services/confirm-dialog.service';

@Component({
  selector: 'app-layout-sidenav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './app-sidenav.component.html',
  styleUrl: './app-sidenav.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppSidenavComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly confirmDialogService: ConfirmDialogService,
  ) {}
  protected readonly primaryItems: LayoutNavItem[] = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      route: '/app/dashboard',
    },
    {
      label: 'Empresas',
      icon: Building2,
      route: '/app/empresas',
    },
    {
      label: 'Proyectos',
      icon: BriefcaseBusiness,
      route: '/app/proyectos',
    },
    {
      label: 'Reportes',
      icon: BarChart3,
      route: '/app/reportes',
    },
    {
      label: 'Usuarios',
      icon: Users,
      route: '/app/usuarios',
    },
  ];

  protected readonly logoutIcon = LogOut;

  protected async onLogout(): Promise<void> {
    const confirmed = await this.confirmDialogService.open({
      question: '¿Cerrar sesión?',
      detail:
        'Se cerrará tu sesión actual en Nodesk Manager. Podrás volver a iniciar sesión cuando lo necesites.',
      confirmText: 'Cerrar sesión',
      cancelText: 'Cancelar',
      tone: 'danger',
      closeOnBackdrop: true,
    });

    if (!confirmed) {
      return;
    }

    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
