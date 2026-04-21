import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DashboardTopCompany } from '../../models/dashboard-top-company.model';

@Component({
  selector: 'app-dashboard-top-companies',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-top-companies.component.html',
  styleUrl: './dashboard-top-companies.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardTopCompaniesComponent {
  @Input() title = 'Top 5 empresas por ingresos';
  @Input() companies: DashboardTopCompany[] = [];
}
