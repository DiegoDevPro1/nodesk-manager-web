import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { map, filter, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {
  LayoutDashboard,
  Users,
  Building2,
  BriefcaseBusiness,
  BarChart3,
  LucideIconData,
} from 'lucide-angular';
import { AppSidenavComponent } from '../../components/app-sidenav/app-sidenav.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { ConfirmModalHostComponent } from '../../../../shared/components/confirm-modal/confirm-modal-host.component';

@Component({
  selector: 'app-layout-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    AppSidenavComponent,
    PageHeaderComponent,
    ConfirmModalHostComponent,
  ],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppLayoutComponent {
  protected readonly header$: Observable<{
    title: string;
    subtitle?: string;
    icon: LucideIconData;
  }>;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
    this.header$ = this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      startWith(null),
      map(() => {
        let child = this.route.firstChild;
        while (child?.firstChild) {
          child = child.firstChild;
        }
        const data = child?.snapshot.data ?? {};
        const path = child?.routeConfig?.path ?? '';

        let icon: LucideIconData = LayoutDashboard;

        if (path.startsWith('usuarios')) {
          icon = Users;
        } else if (path.startsWith('empresas')) {
          icon = Building2;
        } else if (path.startsWith('proyectos')) {
          icon = BriefcaseBusiness;
        } else if (path.startsWith('reportes')) {
          icon = BarChart3;
        } else {
          icon = LayoutDashboard;
        }

        return {
          title: (data['pageTitle'] as string) ?? 'Dashboard',
          subtitle:
            (data['pageSubtitle'] as string) ?? 'Resumen general de tu operacion en Nodesk Manager',
          icon,
        };
      }),
    );
  }
}
