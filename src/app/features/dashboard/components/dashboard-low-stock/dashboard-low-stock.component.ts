import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DashboardLowStockProduct } from '../../models/dashboard-low-stock-product.model';

@Component({
  selector: 'app-dashboard-low-stock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-low-stock.component.html',
  styleUrl: './dashboard-low-stock.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLowStockComponent {
  @Input() title = 'Productos que estan por agotarse';
  @Input() products: DashboardLowStockProduct[] = [];
}
