import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  LucideAngularModule,
  Plus,
  Search,
  ShieldUser,
  Download,
  FileText,
  Edit2,
  ToggleLeft,
  ToggleRight,
  RefreshCcw,
} from 'lucide-angular';
import {
  DataTableComponent,
  DataTableColumn,
  DataTableHeaderAction,
  DataTableRowAction,
} from '../../../../shared/components/data-table/data-table.component';
import { User } from '../../models/user.model';
import { UsersService } from '../../services/users.service';
import { AlertService } from '../../../../core/services/alert.service';
import { ConfirmDialogService } from '../../../../core/services/confirm-dialog.service';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, DataTableComponent],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersPageComponent {
  private readonly usersService = inject(UsersService);
  private readonly alertService = inject(AlertService);
  private readonly router = inject(Router);
  private readonly confirmDialogService = inject(ConfirmDialogService);

  protected readonly headerIcon = ShieldUser;
  protected readonly searchIcon = Search;
  protected readonly plusIcon = Plus;
  protected readonly exportIcon = Download;
  protected readonly viewIcon = FileText;
  protected readonly editIcon = Edit2;
  protected readonly toggleStatusIcon = ToggleLeft;
  protected readonly refreshIcon = RefreshCcw;

  protected readonly loading = signal(false);
  protected readonly page = signal(1);
  protected readonly pageSize = signal(5);
  protected readonly search = signal('');
  protected readonly allUsers = signal<User[]>([]);
  protected readonly totalUsers = signal(0);
  protected readonly togglingStatus = signal(false);

  protected readonly users = computed(() => this.allUsers());
  protected readonly usersView = computed(() => this.users().map((user) => this.getRowView(user)));

  protected readonly columns: DataTableColumn[] = [
    { key: 'name', label: 'Usuario' },
    { key: 'email', label: 'Correo' },
    { key: 'documentType', label: 'Tipo doc.' },
    { key: 'documentNumber', label: 'N.º documento' },
    { key: 'phone', label: 'Teléfono' },
    { key: 'companyName', label: 'Empresa' },
    { key: 'statusLabel', label: 'Estado', align: 'end' },
  ];

  protected readonly tableHeaderActions: DataTableHeaderAction[] = [
    {
      key: 'create',
      label: 'Agregar usuario',
      icon: this.plusIcon,
      variant: 'primary',
    },
    // {
    //   key: 'export',
    //   label: 'Exportar',
    //   icon: this.exportIcon,
    //   variant: 'outline',
    // },
  ];

  protected readonly tableRowActions: DataTableRowAction[] = [
    {
      key: 'detail',
      label: 'Detalle',
      icon: this.viewIcon,
      variant: 'ghost',
    },
    {
      key: 'edit',
      label: 'Editar',
      icon: this.editIcon,
      variant: 'ghost',
    },
    {
      key: 'toggleStatus',
      label: 'Activar / desactivar',
      icon: this.toggleStatusIcon,
      variant: 'ghost',
      getLabel: (row: unknown) => {
        const user = row as User;
        return user.isActive ? 'Desactivar usuario' : 'Activar usuario';
      },
      getIcon: (row: unknown) => {
        const user = row as User;
      return user.isActive ? ToggleLeft : ToggleRight;
    },
    getClass: (row: unknown) => {
      const user = row as User;
      return user.isActive ? null : 'data-table__row-action-btn--action-toggleStatus--inactive';
      },
    },
  ];

  constructor() {
    this.fetchUsers(this.page(), this.pageSize(), this.search());
  }

  protected onTableHeaderAction(actionKey: string): void {
    if (actionKey === 'create') {
      this.router.navigate(['/app/usuarios/nuevo']);
      return;
    }

    // futuros header actions
  }

  protected onTableRowAction(payload: { actionKey: string; row: unknown }): void {
    const row = payload.row as User;

    if (this.loading() || this.togglingStatus()) {
      return;
    }

    if (payload.actionKey === 'detail') {
      this.router.navigate(['/app/usuarios', row.id, 'detalle']);
      return;
    }

    if (payload.actionKey === 'edit') {
      this.router.navigate(['/app/usuarios', row.id, 'editar'], {
        state: { user: row },
      });
      return;
    }

    if (payload.actionKey === 'toggleStatus') {
      this.onToggleStatus(row);
      return;
    }
  }

  protected onTableSearch(term: string): void {
    const value = term.trim();
    this.search.set(value);
    this.fetchUsers(this.page(), this.pageSize(), value);
  }

  protected onTablePageSizeChange(size: number): void {
    if (!size || size <= 0) {
      return;
    }

    this.pageSize.set(size);
    this.page.set(1);
    this.fetchUsers(1, size, this.search());
  }

  protected onTablePageChange(page: number): void {
    if (!page || page <= 0) {
      return;
    }

    this.page.set(page);
    this.fetchUsers(page, this.pageSize(), this.search());
  }

  protected getRowView(row: User): unknown {
    return {
      ...row,
      documentType: row.documentType?.trim() || 'No Definido',
      documentNumber: row.documentNumber?.trim() || 'No Definido',
      phone: row.phone?.trim() || 'No Definido',
      companyName: row.company?.name ?? 'Sin empresa',
      statusLabel: row.isActive ? 'Activo' : 'Inactivo',
    };
  }

  protected async onToggleStatus(user: User): Promise<void> {
    const nextIsActive = !user.isActive;

    const confirmed = await this.confirmDialogService.open({
      question: nextIsActive ? '¿Activar usuario?' : '¿Desactivar usuario?',
      detail: nextIsActive
        ? `El usuario ${user.name} podrá volver a acceder a Nodesk Manager.`
        : `El usuario ${user.name} ya no podrá acceder a Nodesk Manager hasta que lo vuelvas a activar.`,
      confirmText: nextIsActive ? 'Activar' : 'Desactivar',
      cancelText: 'Cancelar',
      tone: 'warning',
      closeOnBackdrop: true,
    });

    if (!confirmed) {
      return;
    }

    this.togglingStatus.set(true);

    try {
      await this.usersService
        .updateStaffStatus(user.id, { isActive: nextIsActive })
        .toPromise();

      this.alertService.success(
        nextIsActive ? 'El usuario se activó correctamente.' : 'El usuario se desactivó correctamente.',
        {
          title: nextIsActive ? 'Usuario activado' : 'Usuario desactivado',
        },
      );

      this.fetchUsers(this.page(), this.pageSize(), this.search());
    } catch {
      this.alertService.error('No se pudo actualizar el estado del usuario.', {
        title: 'Error al actualizar usuario',
      });
    } finally {
      this.togglingStatus.set(false);
    }
  }

  private async fetchUsers(page: number, limit: number, search: string): Promise<void> {
    if (this.loading()) {
      return;
    }

    this.loading.set(true);

    try {
      const response = await this.usersService
        .getOwners({ page, limit, search: search || undefined })
        .toPromise();

      const payload = response?.data;
      const rawUsers = payload?.data ?? [];

      const users = rawUsers.map((rawUser: unknown) => {
        const user = rawUser as User & {
          document_type?: string | null;
          document_number?: string | null;
        };

        return {
          ...user,
          documentType: user.documentType ?? user.document_type ?? null,
          documentNumber: user.documentNumber ?? user.document_number ?? null,
        };
      });

      this.allUsers.set(users);

      const meta = payload?.meta;
      this.totalUsers.set(meta?.total ?? users.length);

      if (meta?.page) {
        this.page.set(meta.page);
      }

      if (meta?.limit) {
        this.pageSize.set(meta.limit);
      }
    } catch {
      this.alertService.error('No se pudo cargar la lista de usuarios.', {
        title: 'Error al obtener usuarios',
      });
      this.allUsers.set([]);
    } finally {
      this.loading.set(false);
    }
  }
}
