import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DetailFieldComponent } from '../../../../shared/components/detail-field/detail-field.component';
import { User } from '../../models/user.model';
import { mapUserRoleToLabel } from '../../models/user-role-label.mapper';
import { UsersService } from '../../services/users.service';
import { AlertService } from '../../../../core/services/alert.service';

@Component({
  selector: 'app-user-detail-page',
  standalone: true,
  imports: [CommonModule, DetailFieldComponent],
  templateUrl: './user-detail-page.component.html',
  styleUrl: './user-detail-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailPageComponent {
  private readonly usersService = inject(UsersService);
  private readonly alertService = inject(AlertService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly loading = signal(false);
  protected readonly user = signal<User | null>(null);

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;

    if (!id || Number.isNaN(id)) {
      this.router.navigate(['/app/usuarios']);
      return;
    }

    this.loadUser(id);
  }

  protected onBack(): void {
    this.router.navigate(['/app/usuarios']);
  }

  protected resolveRoleLabel(): string {
    return mapUserRoleToLabel(this.user()?.role);
  }

  private async loadUser(id: number): Promise<void> {
    if (this.loading()) {
      return;
    }

    this.loading.set(true);

    try {
      const response = await firstValueFrom(this.usersService.getOwnerById(id));
      this.user.set(response.data);
    } catch {
      this.alertService.error('No se pudo cargar el detalle del usuario.', {
        title: 'Error al obtener usuario',
      });
      this.router.navigate(['/app/usuarios']);
    } finally {
      this.loading.set(false);
    }
  }
}
