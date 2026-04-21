import { Injectable, signal } from '@angular/core';
import { AlertItem, AlertOptions, AlertPosition, AlertType } from '../models/alert/alert.model';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  readonly alerts = signal<AlertItem[]>([]);

  private readonly timeoutMap = new Map<string, ReturnType<typeof setTimeout>>();

  show(options: AlertOptions): string {
    const alert: AlertItem = {
      id: this.generateId(),
      title: options.title ?? this.getDefaultTitle(options.type ?? 'info'),
      message: options.message,
      type: options.type ?? 'info',
      position: options.position ?? 'top-right',
      duration: options.duration ?? 5000,
      closable: options.closable ?? true,
      createdAt: Date.now(),
    };

    this.alerts.update((currentAlerts) => [...currentAlerts, alert]);

    if (alert.duration && alert.duration > 0) {
      const timeoutId = setTimeout(() => this.close(alert.id), alert.duration);
      this.timeoutMap.set(alert.id, timeoutId);
    }

    return alert.id;
  }

  success(message: string, options?: Omit<AlertOptions, 'message' | 'type'>): string {
    return this.show({ ...options, message, type: 'success' });
  }

  info(message: string, options?: Omit<AlertOptions, 'message' | 'type'>): string {
    return this.show({ ...options, message, type: 'info' });
  }

  warning(message: string, options?: Omit<AlertOptions, 'message' | 'type'>): string {
    return this.show({ ...options, message, type: 'warning' });
  }

  error(message: string, options?: Omit<AlertOptions, 'message' | 'type'>): string {
    return this.show({ ...options, message, type: 'error' });
  }

  close(alertId: string): void {
    const timeoutId = this.timeoutMap.get(alertId);

    if (timeoutId) {
      clearTimeout(timeoutId);
      this.timeoutMap.delete(alertId);
    }

    this.alerts.update((currentAlerts) => currentAlerts.filter((alert) => alert.id !== alertId));
  }

  clear(): void {
    this.timeoutMap.forEach((timeoutId) => clearTimeout(timeoutId));
    this.timeoutMap.clear();
    this.alerts.set([]);
  }

  private getDefaultTitle(type: AlertType): string {
    const titleMap: Record<AlertType, string> = {
      success: 'Success',
      info: 'Info',
      warning: 'Warning',
      error: 'Error',
    };

    return titleMap[type];
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }

  getAlertsByPosition(position: AlertPosition): AlertItem[] {
    return this.alerts().filter((alert) => alert.position === position);
  }
}
