import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { FormInputComponent } from '../../../../shared/components/form-input/form-input.component';
import {
  FormRadioGroupComponent,
  FormRadioOption,
} from '../../../../shared/components/form-radio-group/form-radio-group.component';
import {
  FormSelectComponent,
  FormSelectOption,
} from '../../../../shared/components/form-select/form-select.component';
import { AlertService } from '../../../../core/services/alert.service';
import { ConfirmDialogService } from '../../../../core/services/confirm-dialog.service';
import { User } from '../../models/user.model';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-user-edit-page',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    FormInputComponent,
    FormSelectComponent,
    FormRadioGroupComponent,
  ],
  templateUrl: './user-edit-page.component.html',
  styleUrl: './user-edit-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserEditPageComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly usersService = inject(UsersService);
  private readonly alertService = inject(AlertService);
  private readonly confirmDialogService = inject(ConfirmDialogService);

  protected readonly loading = signal(false);
  protected readonly isSubmitting = signal(false);
  protected userId: number | null = null;

  private _name = '';
  private _email = '';
  private _documentType: string | null = null;
  private _documentNumber = '';
  private _phone = '';
  private _isActive: string | null = 'true';

  protected errors: Partial<
    Record<'name' | 'email' | 'documentType' | 'documentNumber' | 'phone' | 'isActive', string>
  > = {};

  protected get name(): string {
    return this._name;
  }

  protected set name(value: string) {
    this._name = value;
    this.validateField('name');
  }

  protected get email(): string {
    return this._email;
  }

  protected set email(value: string) {
    this._email = value;
    this.validateField('email');
  }

  protected get documentType(): string | null {
    return this._documentType;
  }

  protected set documentType(value: string | null) {
    this._documentType = value || null;
    this.validateField('documentType');
  }

  protected get documentNumber(): string {
    return this._documentNumber;
  }

  protected set documentNumber(value: string) {
    this._documentNumber = value;
    this.validateField('documentNumber');
  }

  protected get phone(): string {
    return this._phone;
  }

  protected set phone(value: string) {
    this._phone = value;
    this.validateField('phone');
  }

  protected get isActive(): string | null {
    return this._isActive;
  }

  protected set isActive(value: string | null) {
    this._isActive = value || null;
    this.validateField('isActive');
  }

  protected readonly documentTypeOptions: FormSelectOption[] = [
    { label: 'DNI', value: 'DNI' },
    { label: 'RUC', value: 'RUC' },
    { label: 'Carnet de extranjería', value: 'CE' },
    { label: 'Pasaporte', value: 'PASSPORT' },
  ];

  protected readonly statusOptions: FormRadioOption[] = [
    {
      label: 'Activo',
      value: 'true',
    },
    {
      label: 'Inactivo',
      value: 'false',
    },
  ];

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;

    if (!id || Number.isNaN(id)) {
      this.router.navigate(['/app/usuarios']);
      return;
    }

    this.userId = id;
    this.loadUser(id);
  }

  protected onCancel(): void {
    this.router.navigate(['/app/usuarios']);
  }

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    if (this.loading() || this.isSubmitting() || !this.userId) {
      return;
    }

    const isValid = this.validateForm();

    if (!isValid) {
      return;
    }

    const confirmed = await this.confirmDialogService.open({
      question: '¿Actualizar usuario?',
      detail: 'Se guardarán los cambios realizados en la información principal del usuario.',
      confirmText: 'Guardar cambios',
      cancelText: 'Cancelar',
      tone: 'warning',
      closeOnBackdrop: true,
    });

    if (!confirmed) {
      return;
    }

    this.isSubmitting.set(true);

    try {
      await firstValueFrom(
        this.usersService.updateUser(this.userId, {
          name: this.name.trim(),
          email: this.email.trim(),
          documentType: this.documentType as string,
          documentNumber: this.documentNumber.trim(),
          phone: this.phone.trim(),
          isActive: this.isActive === 'true',
        }),
      );

      await this.loadUser(this.userId);

      this.alertService.success('La información del usuario se actualizó correctamente.', {
        title: 'Usuario actualizado',
      });
    } catch {
      this.alertService.error('No se pudo actualizar la información del usuario.', {
        title: 'Error al actualizar usuario',
      });
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private async loadUser(id: number): Promise<void> {
    if (this.loading()) {
      return;
    }

    this.loading.set(true);

    try {
      const response = await firstValueFrom(this.usersService.getOwnerById(id));
      this.fillForm(response.data);
    } catch {
      this.alertService.error('No se pudo cargar la información del usuario.', {
        title: 'Error al obtener usuario',
      });
      this.router.navigate(['/app/usuarios']);
    } finally {
      this.loading.set(false);
    }
  }

  private fillForm(user: User): void {
    this.name = user.name?.trim() ?? '';
    this.email = user.email?.trim() ?? '';
    this.documentType = this.normalizeDocumentType(user.documentType);
    this.documentNumber = user.documentNumber?.trim() ?? '';
    this.phone = user.phone?.trim() ?? '';
    this.isActive = user.isActive ? 'true' : 'false';
  }

  private validateForm(): boolean {
    this.validateField('name');
    this.validateField('email');
    this.validateField('documentType');
    this.validateField('documentNumber');
    this.validateField('phone');
    this.validateField('isActive');

    return Object.keys(this.errors).length === 0;
  }

  private validateField(
    field: 'name' | 'email' | 'documentType' | 'documentNumber' | 'phone' | 'isActive',
  ): void {
    const errors: typeof this.errors = { ...this.errors };

    if (field === 'name') {
      const name = this.name.trim();
      if (!name) {
        errors.name = 'El nombre es obligatorio.';
      } else if (name.length < 3) {
        errors.name = 'El nombre debe tener al menos 3 caracteres.';
      } else {
        delete errors.name;
      }
    }

    if (field === 'email') {
      const email = this.email.trim();
      if (!email) {
        errors.email = 'El correo es obligatorio.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Ingresa un correo electrónico válido.';
      } else {
        delete errors.email;
      }
    }

    if (field === 'documentType') {
      if (!this.documentType) {
        errors.documentType = 'Selecciona un tipo de documento.';
      } else {
        delete errors.documentType;
      }
    }

    if (field === 'documentNumber') {
      const documentNumber = this.documentNumber.trim();
      if (!documentNumber) {
        errors.documentNumber = 'El número de documento es obligatorio.';
      } else if (!/^\d{8,12}$/.test(documentNumber)) {
        errors.documentNumber = 'El número de documento debe contener solo números.';
      } else {
        delete errors.documentNumber;
      }
    }

    if (field === 'phone') {
      const phone = this.phone.trim();
      if (!phone) {
        errors.phone = 'El teléfono es obligatorio.';
      } else {
        const digits = phone.replace(/\D/g, '');
        if (digits.length < 9) {
          errors.phone = 'El teléfono debe tener al menos 9 dígitos.';
        } else {
          delete errors.phone;
        }
      }
    }

    if (field === 'isActive') {
      if (this.isActive !== 'true' && this.isActive !== 'false') {
        errors.isActive = 'Selecciona el estado del usuario.';
      } else {
        delete errors.isActive;
      }
    }

    this.errors = errors;
  }

  private normalizeDocumentType(value: string | null): string | null {
    const normalized = value?.trim().toUpperCase() ?? '';

    if (!normalized) {
      return null;
    }

    if (normalized === 'DNI' || normalized === 'RUC' || normalized === 'CE' || normalized === 'PASSPORT') {
      return normalized;
    }

    if (normalized === 'CARNET DE EXTRANJERIA' || normalized === 'CARNET DE EXTRANJERÍA') {
      return 'CE';
    }

    if (normalized === 'PASAPORTE') {
      return 'PASSPORT';
    }

    return normalized;
  }
}

