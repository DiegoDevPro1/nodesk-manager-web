import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule, ArrowLeft, ShieldUser } from 'lucide-angular';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { FormInputComponent } from '../../../../shared/components/form-input/form-input.component';
import {
  FormSelectComponent,
  FormSelectOption,
} from '../../../../shared/components/form-select/form-select.component';
import {
  FormRadioGroupComponent,
  FormRadioOption,
} from '../../../../shared/components/form-radio-group/form-radio-group.component';

@Component({
  selector: 'app-user-create-page',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    PageHeaderComponent,
    ButtonComponent,
    FormInputComponent,
    FormSelectComponent,
    FormRadioGroupComponent,
  ],
  templateUrl: './user-create-page.component.html',
  styleUrl: './user-create-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCreatePageComponent {
  protected readonly headerIcon = ShieldUser;
  protected readonly backIcon = ArrowLeft;

  protected name = '';
  protected email = '';
  protected documentType: string | null = null;
  protected documentNumber = '';
  protected phone = '';
  protected role: string | null = 'owner';
  protected companyId: string | null = null;
  protected status: string | null = 'active';

  protected readonly roleOptions: FormRadioOption[] = [
    { label: 'Super Admin', value: 'superadmin', description: 'Acceso total a la plataforma.' },
    { label: 'Owner', value: 'owner', description: 'Administra la empresa asignada.' },
    { label: 'Staff', value: 'staff', description: 'Acceso operativo limitado.' },
  ];

  protected readonly statusOptions: FormRadioOption[] = [
    {
      label: 'Activo',
      value: 'active',
      description: 'Puede iniciar sesión y usar Nodesk Manager.',
    },
    {
      label: 'Inactivo',
      value: 'inactive',
      description: 'No podrá acceder hasta que lo reactives.',
    },
  ];

  protected readonly documentTypeOptions: FormSelectOption[] = [
    { label: 'DNI', value: 'dni' },
    { label: 'RUC', value: 'ruc' },
    { label: 'Pasaporte', value: 'passport' },
  ];

  protected readonly companyOptions: FormSelectOption[] = [
    { label: 'Seleccionar empresa', value: 'default' },
    { label: 'DpSystems', value: '1' },
    { label: 'Empresa demo', value: '2' },
  ];

  constructor(private readonly router: Router) {}

  protected onCancel(): void {
    this.router.navigate(['/app/usuarios']);
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
  }
}

