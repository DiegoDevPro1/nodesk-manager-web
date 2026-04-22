import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { FormInputComponent } from '../../../../shared/components/form-input/form-input.component';
import {
  FormSelectComponent,
  FormSelectOption,
} from '../../../../shared/components/form-select/form-select.component';
import { UsersService } from '../../services/users.service';
import { AlertService } from '../../../../core/services/alert.service';
import { ConfirmDialogService } from '../../../../core/services/confirm-dialog.service';

@Component({
  selector: 'app-user-create-page',
  standalone: true,
  imports: [CommonModule, ButtonComponent, FormInputComponent, FormSelectComponent],
  templateUrl: './user-create-page.component.html',
  styleUrl: './user-create-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCreatePageComponent {
  protected name = '';
  protected email = '';
  protected password = '';
  protected documentType: string | null = null;
  protected documentNumber = '';
  protected phone = '';

  protected isSubmitting = false;

  protected errors: Partial<
    Record<'name' | 'email' | 'password' | 'documentType' | 'documentNumber' | 'phone', string>
  > = {};

  protected readonly documentTypeOptions: FormSelectOption[] = [
    { label: 'DNI', value: 'DNI' },
    { label: 'RUC', value: 'RUC' },
    { label: 'Pasaporte', value: 'PASSPORT' },
  ];

  constructor(
    private readonly router: Router,
    private readonly usersService: UsersService,
    private readonly alertService: AlertService,
    private readonly confirmDialogService: ConfirmDialogService,
  ) {}

  protected onCancel(): void {
    this.router.navigate(['/app/usuarios']);
  }

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    if (this.isSubmitting) {
      return;
    }

    const isValid = this.validateForm();

    if (!isValid) {
      return;
    }

    const confirmed = await this.confirmDialogService.open({
      question: '¿Crear usuario?',
      detail: 'Se registrará un nuevo usuario owner en Nodesk Manager con los datos ingresados.',
      confirmText: 'Crear usuario',
      cancelText: 'Cancelar',
      tone: 'danger',
      closeOnBackdrop: true,
    });

    if (!confirmed) {
      return;
    }

    this.isSubmitting = true;

    try {
      await this.usersService
        .createOwner({
          name: this.name.trim(),
          email: this.email.trim(),
          password: this.password,
          documentType: this.documentType as string,
          documentNumber: this.documentNumber.trim(),
          phone: this.phone.trim(),
        })
        .toPromise();

      this.alertService.success('El usuario se creó correctamente.', {
        title: 'Usuario creado',
      });

      this.router.navigate(['/app/usuarios']);
    } catch {
      this.alertService.error('No se pudo crear el usuario.', {
        title: 'Error al crear usuario',
      });
    } finally {
      this.isSubmitting = false;
    }
  }

  private validateForm(): boolean {
    const errors: typeof this.errors = {};

    const name = this.name.trim();
    if (!name) {
      errors.name = 'El nombre es obligatorio.';
    } else if (name.length < 3) {
      errors.name = 'El nombre debe tener al menos 3 caracteres.';
    }

    const email = this.email.trim();
    if (!email) {
      errors.email = 'El correo es obligatorio.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Ingresa un correo electrónico válido.';
    }

    if (!this.password) {
      errors.password = 'La contraseña es obligatoria.';
    } else if (this.password.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres.';
    }

    if (!this.documentType) {
      errors.documentType = 'Selecciona un tipo de documento.';
    }

    const documentNumber = this.documentNumber.trim();
    if (!documentNumber) {
      errors.documentNumber = 'El número de documento es obligatorio.';
    } else if (!/^\d{8,12}$/.test(documentNumber)) {
      errors.documentNumber = 'El número de documento debe contener solo números.';
    }

    const phone = this.phone.trim();
    if (!phone) {
      errors.phone = 'El teléfono es obligatorio.';
    } else {
      const digits = phone.replace(/\D/g, '');
      if (digits.length < 9) {
        errors.phone = 'El teléfono debe tener al menos 9 dígitos.';
      }
    }

    this.errors = errors;

    return Object.keys(errors).length === 0;
  }
}
