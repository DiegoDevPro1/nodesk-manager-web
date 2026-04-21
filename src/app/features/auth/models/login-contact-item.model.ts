export type LoginContactIcon = 'phone' | 'mail' | 'globe' | 'location';

export interface LoginContactItem {
  icon: LoginContactIcon;
  label: string;
  href?: string;
}
