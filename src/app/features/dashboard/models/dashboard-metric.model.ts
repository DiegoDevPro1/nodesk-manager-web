import { LucideIconData } from 'lucide-angular';

export type DashboardMetricTrend = 'up' | 'down' | 'neutral';

export interface DashboardMetric {
  id: string;
  title: string;
  value: string;
  hint?: string;
  trendLabel?: string;
  trendType: DashboardMetricTrend;
  icon: LucideIconData;
  accent: 'indigo' | 'amber' | 'rose';
}
