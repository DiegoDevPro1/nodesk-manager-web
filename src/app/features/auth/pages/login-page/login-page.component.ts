import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApiErrorResponse } from '../../../../core/models/api/api-error.model';
import { AlertService } from '../../../../core/services/alert.service';
import { LoginContactListComponent } from '../../components/login-contact-list/login-contact-list.component';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { LoginHeroComponent } from '../../components/login-hero/login-hero.component';
import { LoginContactItem } from '../../models/login-contact-item.model';
import { LoginRequest } from '../../models/login-request.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, LoginHeroComponent, LoginFormComponent, LoginContactListComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  private readonly authService = inject(AuthService);
  private readonly alertService = inject(AlertService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly loading = signal(false);

  protected readonly contacts: LoginContactItem[] = [
    {
      icon: 'phone',
      label: '+51 900 022 720',
      href: 'tel:+51900022720',
    },
    {
      icon: 'mail',
      label: 'ventas@nodesk.pe',
      href: 'mailto:ventas@nodesk.pe',
    },
    {
      icon: 'globe',
      label: 'nodesk.pe',
      href: 'https://nodesk.pe',
    },
    {
      icon: 'location',
      label: 'Lima, Perú',
    },
  ];

  protected async onLogin(credentials: LoginRequest): Promise<void> {
    if (this.loading()) {
      return;
    }

    this.loading.set(true);

    try {
      const response = await firstValueFrom(this.authService.login(credentials));

      this.alertService.success(`Bienvenido nuevamente, ${response.data.user.name}.`, {
        title: 'Inicio de sesión exitoso',
      });

      const returnUrl =
        this.route.snapshot.queryParamMap.get('returnUrl') ?? '/app/dashboard';

      await this.router.navigateByUrl(returnUrl);
    } catch (error) {
      this.alertService.error(this.resolveErrorMessage(error), {
        title: 'No se pudo iniciar sesión',
      });
    } finally {
      this.loading.set(false);
    }
  }

  private resolveErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const apiError = error.error as Partial<ApiErrorResponse> | undefined;

      if (Array.isArray(apiError?.message) && apiError.message.length > 0) {
        return apiError.message[0];
      }

      if (typeof apiError?.message === 'string' && apiError.message.trim()) {
        return apiError.message;
      }
    }

    return 'Verifica tus credenciales e inténtalo nuevamente.';
  }
}
