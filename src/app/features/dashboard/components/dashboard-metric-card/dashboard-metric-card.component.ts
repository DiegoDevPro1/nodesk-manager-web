import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';
import { DashboardMetricTrend } from '../../models/dashboard-metric.model';

@Component({
  selector: 'app-dashboard-metric-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './dashboard-metric-card.component.html',
  styleUrl: './dashboard-metric-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardMetricCardComponent {
  @Input() title = '';
  @Input() value = '';
  @Input() hint?: string;
  @Input() trendLabel?: string;
  @Input() trendType: DashboardMetricTrend = 'neutral';
  @Input() icon?: LucideIconData;
  @Input() accent: 'indigo' | 'amber' | 'rose' = 'indigo';
}
