import { LucideIconData } from 'lucide-angular';

export interface LayoutNavItem {
  label: string;
  icon: LucideIconData;
  route?: string;
  badge?: string;
}
