import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ConfirmDialogState,
  ConfirmDialogTone,
} from '../../../core/models/confirm-dialog/confirm-dialog.model';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmModalComponent {
  @Input({ required: true }) dialog!: ConfirmDialogState;
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  get toneClasses() {
    const toneMap: Record<
      ConfirmDialogTone,
      {
        iconWrapper: string;
        iconColor: string;
        confirmButton: string;
        ringClass: string;
      }
    > = {
      danger: {
        iconWrapper: 'bg-rose-50',
        iconColor: 'text-rose-500',
        confirmButton: 'bg-rose-600 text-white hover:bg-rose-700 focus-visible:outline-rose-600',
        ringClass: 'ring-rose-100',
      },
      primary: {
        iconWrapper: 'bg-sky-50',
        iconColor: 'text-sky-500',
        confirmButton: 'bg-sky-600 text-white hover:bg-sky-700 focus-visible:outline-sky-600',
        ringClass: 'ring-sky-100',
      },
      warning: {
        iconWrapper: 'bg-amber-50',
        iconColor: 'text-amber-500',
        confirmButton: 'bg-amber-500 text-white hover:bg-amber-600 focus-visible:outline-amber-500',
        ringClass: 'ring-amber-100',
      },
      success: {
        iconWrapper: 'bg-emerald-50',
        iconColor: 'text-emerald-500',
        confirmButton:
          'bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:outline-emerald-600',
        ringClass: 'ring-emerald-100',
      },
      neutral: {
        iconWrapper: 'bg-slate-100',
        iconColor: 'text-slate-500',
        confirmButton:
          'bg-slate-900 text-white hover:bg-slate-700 focus-visible:outline-slate-900',
        ringClass: 'ring-slate-200',
      },
    };

    return toneMap[this.dialog.tone];
  }

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
