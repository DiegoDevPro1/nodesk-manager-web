export type ConfirmDialogTone = 'danger' | 'primary' | 'warning' | 'success' | 'neutral';

export interface ConfirmDialogOptions {
  question: string;
  detail?: string;
  confirmText?: string;
  cancelText?: string;
  tone?: ConfirmDialogTone;
  closeOnBackdrop?: boolean;
}

export interface ConfirmDialogState {
  question: string;
  detail: string;
  confirmText: string;
  cancelText: string;
  tone: ConfirmDialogTone;
  closeOnBackdrop: boolean;
}
