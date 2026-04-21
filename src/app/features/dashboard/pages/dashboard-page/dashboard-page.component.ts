import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FileText,
  LineChart,
  LucideAngularModule,
  ReceiptText,
  Store,
} from 'lucide-angular';
import { DashboardMetric } from '../../models/dashboard-metric.model';
import { DashboardLowStockProduct } from '../../models/dashboard-low-stock-product.model';
import { DashboardTopCompany } from '../../models/dashboard-top-company.model';
import { DashboardLowStockComponent } from '../../components/dashboard-low-stock/dashboard-low-stock.component';
import { DashboardMetricCardComponent } from '../../components/dashboard-metric-card/dashboard-metric-card.component';
import { DashboardTopCompaniesComponent } from '../../components/dashboard-top-companies/dashboard-top-companies.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    DashboardMetricCardComponent,
    DashboardTopCompaniesComponent,
    DashboardLowStockComponent,
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent {
  protected readonly metrics: DashboardMetric[] = [
    {
      id: 'companies',
      title: 'Empresas registradas',
      value: '350',
      hint: 'CPEs emitidos',
      icon: Store,
      trendLabel: '+3 nuevas',
      trendType: 'up',
      accent: 'indigo',
    },
    {
      id: 'documents',
      title: 'Total de comprobantes',
      value: '5,000',
      hint: 'Incluye facturas y boletas',
      icon: ReceiptText,
      trendLabel: '+5.0‰',
      trendType: 'up',
      accent: 'amber',
    },
    {
      id: 'sales-notes',
      title: 'Total notas de venta',
      value: '14.9K',
      hint: 'Incluye notas pagadas en POS',
      icon: FileText,
      trendLabel: '-1.5‰',
      trendType: 'down',
      accent: 'rose',
    },
  ];

  protected readonly topCompanies: DashboardTopCompany[] = [
    {
      name: 'Empresa 1',
      value: 25000,
    },
    {
      name: 'Empresa 2',
      value: 45000,
    },
    {
      name: 'Empresa 3',
      value: 72000,
    },
    {
      name: 'Empresa 4',
      value: 98000,
    },
  ];

  protected readonly lowStockProducts: DashboardLowStockProduct[] = [
    {
      name: 'Arroz',
      stock: 10,
    },
    {
      name: 'Aceite',
      stock: 10,
    },
    {
      name: 'Desarmador',
      stock: 10,
    },
    {
      name: 'Distribuidora ABC',
      stock: 10,
    },
    {
      name: 'Distribuidora XYZ',
      stock: 10,
    },
  ];

  protected readonly trendIcon = LineChart;
}

