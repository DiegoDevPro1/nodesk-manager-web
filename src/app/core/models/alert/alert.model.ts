export type AlertType = 'success' | 'info' | 'warning' | 'error';
export type AlertPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface AlertOptions {
  message: string;
  title?: string;
  type?: AlertType;
  position?: AlertPosition;
  duration?: number | null;
  closable?: boolean;
}

export interface AlertItem {
  id: string;
  title: string;
  message: string;
  type: AlertType;
  position: AlertPosition;
  duration: number | null;
  closable: boolean;
  createdAt: number;
}
