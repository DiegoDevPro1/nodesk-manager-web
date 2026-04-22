import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';

export interface DataTableColumn {
  key: string;
  label: string;
  align?: 'start' | 'center' | 'end';
  width?: string;
}

export type DataTableActionVariant = 'primary' | 'outline' | 'ghost';

export interface DataTableHeaderAction {
  key: string;
  label: string;
  icon?: LucideIconData;
  variant?: DataTableActionVariant;
}

export interface DataTableRowAction {
  key: string;
  label: string;
  icon?: LucideIconData;
  variant?: DataTableActionVariant;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent {
  @Input() columns: DataTableColumn[] = [];
  @Input() rows: unknown[] = [];
  @Input() emptyLabel = 'No hay datos para mostrar';
  @Input() pageSizeOptions: number[] = [5, 10, 25];
  @Input() pageSize = 10;
  @Input() headerActions: DataTableHeaderAction[] = [];
  @Input() rowActions: DataTableRowAction[] = [];
  @Input() enableSearch = false;
  @Input() searchPlaceholder = 'Buscar...';
  @Input() searchIcon?: LucideIconData;
  @Input() searchValue = '';

  @Output() headerAction = new EventEmitter<string>();
  @Output() rowAction = new EventEmitter<{ actionKey: string; row: unknown }>();
  @Output() searchChange = new EventEmitter<string>();
   @Output() pageSizeChange = new EventEmitter<number>();

  protected pageIndex = 0;

  protected get totalRows(): number {
    return this.rows.length;
  }

  protected get totalPages(): number {
    if (!this.pageSize || this.pageSize <= 0) {
      return 1;
    }
    return Math.max(1, Math.ceil(this.totalRows / this.pageSize));
  }

  protected get startIndex(): number {
    if (!this.totalRows) {
      return 0;
    }
    return this.pageIndex * this.pageSize + 1;
  }

  protected get endIndex(): number {
    if (!this.totalRows) {
      return 0;
    }
    const end = (this.pageIndex + 1) * this.pageSize;
    return end > this.totalRows ? this.totalRows : end;
  }

  protected get pagedRows(): unknown[] {
    if (!this.pageSize || this.pageSize <= 0) {
      return this.rows;
    }
    const start = this.pageIndex * this.pageSize;
    return this.rows.slice(start, start + this.pageSize);
  }

  protected setPage(index: number): void {
    if (!this.totalRows) {
      this.pageIndex = 0;
      return;
    }
    const max = this.totalPages - 1;
    if (index < 0) {
      this.pageIndex = 0;
    } else if (index > max) {
      this.pageIndex = max;
    } else {
      this.pageIndex = index;
    }
  }

  protected nextPage(): void {
    this.setPage(this.pageIndex + 1);
  }

  protected previousPage(): void {
    this.setPage(this.pageIndex - 1);
  }

  protected onPageSizeChange(value: string): void {
    const size = Number(value);
    if (!Number.isNaN(size) && size > 0) {
      this.pageSize = size;
      this.pageIndex = 0;
      this.pageSizeChange.emit(this.pageSize);
    }
  }

  protected getValue(row: unknown, key: string): unknown {
    return (row as { [valueKey: string]: unknown })[key];
  }

  protected onHeaderAction(key: string): void {
    this.headerAction.emit(key);
  }

  protected onRowAction(key: string, row: unknown): void {
    this.rowAction.emit({ actionKey: key, row });
  }

  protected onSearchChange(value: string): void {
    this.searchValue = value;
    this.searchChange.emit(value);
  }
}
