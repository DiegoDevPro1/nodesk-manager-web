import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertItem, AlertType } from '../../../core/models/alert/alert.model';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
  @Input({ required: true }) alert!: AlertItem;
  @Output() closed = new EventEmitter<string>();

  get theme() {
    const themeMap: Record<
      AlertType,
      {
        borderClass: string;
        accentClass: string;
        iconBgClass: string;
        iconClass: string;
      }
    > = {
      success: {
        borderClass: 'border-l-4 border-l-emerald-500',
        accentClass: 'bg-emerald-500',
        iconBgClass: 'bg-emerald-50',
        iconClass: 'text-emerald-500',
      },
      info: {
        borderClass: 'border-l-4 border-l-sky-500',
        accentClass: 'bg-sky-500',
        iconBgClass: 'bg-sky-50',
        iconClass: 'text-sky-500',
      },
      warning: {
        borderClass: 'border-l-4 border-l-amber-500',
        accentClass: 'bg-amber-500',
        iconBgClass: 'bg-amber-50',
        iconClass: 'text-amber-500',
      },
      error: {
        borderClass: 'border-l-4 border-l-rose-500',
        accentClass: 'bg-rose-500',
        iconBgClass: 'bg-rose-50',
        iconClass: 'text-rose-500',
      },
    };

    return themeMap[this.alert.type];
  }

  onClose(): void {
    this.closed.emit(this.alert.id);
  }
}
