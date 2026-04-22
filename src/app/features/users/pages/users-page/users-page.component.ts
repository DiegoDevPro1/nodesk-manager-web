import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  LucideAngularModule,
  Plus,
  Search,
  ShieldUser,
  Download,
  Eye,
  Pencil,
  Ban,
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

  protected readonly headerIcon = ShieldUser;
  protected readonly searchIcon = Search;
  protected readonly plusIcon = Plus;
  protected readonly exportIcon = Download;
  protected readonly viewIcon = Eye;
  protected readonly editIcon = Pencil;
  protected readonly toggleStatusIcon = Ban;
  protected readonly refreshIcon = RefreshCcw;

  protected readonly loading = signal(false);
  protected readonly page = signal(1);
  protected readonly pageSize = signal(10);
  protected readonly search = signal('');
  protected readonly allUsers = signal<User[]>([]);

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

    if (payload.actionKey === 'detail') {
      return;
    }

    if (payload.actionKey === 'edit') {
      return;
    }

    if (payload.actionKey === 'toggleStatus') {
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

  private async fetchUsers(page: number, limit: number, search: string): Promise<void> {
    if (this.loading()) {
      return;
    }

    this.loading.set(true);

    try {
      const response = await this.usersService
        .getOwners({ page, limit, search: search || undefined })
        .toPromise();

      const users = (response?.data.data ?? []).map((rawUser: unknown) => {
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
