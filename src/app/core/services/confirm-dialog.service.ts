import { Injectable, signal } from '@angular/core';
import { ConfirmDialogOptions, ConfirmDialogState } from '../models/confirm-dialog/confirm-dialog.model';

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  readonly dialog = signal<ConfirmDialogState | null>(null);

  private resolver: ((result: boolean) => void) | null = null;

  open(options: ConfirmDialogOptions): Promise<boolean> {
    if (this.resolver) {
      this.cancel();
    }

    this.dialog.set({
      question: options.question,
      detail: options.detail ?? '',
      confirmText: options.confirmText ?? 'Aceptar',
      cancelText: options.cancelText ?? 'Cancelar',
      tone: options.tone ?? 'danger',
      closeOnBackdrop: options.closeOnBackdrop ?? true,
    });

    return new Promise<boolean>((resolve) => {
      this.resolver = resolve;
    });
  }

  confirm(): void {
    this.resolve(true);
  }

  cancel(): void {
    this.resolve(false);
  }

  closeFromBackdrop(): void {
    if (this.dialog()?.closeOnBackdrop) {
      this.cancel();
    }
  }

  private resolve(result: boolean): void {
    const currentResolver = this.resolver;

    this.dialog.set(null);
    this.resolver = null;

    currentResolver?.(result);
  }
}
