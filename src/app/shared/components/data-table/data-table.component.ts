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
  getLabel?: (row: unknown) => string;
  getIcon?: (row: unknown) => LucideIconData | undefined;
  getClass?: (row: unknown) => string | string[] | null | undefined;
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
  @Input() pageSize = 5;
  @Input() page = 1;
  @Input() totalItems = 0;
  @Input() headerActions: DataTableHeaderAction[] = [];
  @Input() rowActions: DataTableRowAction[] = [];
  @Input() enableSearch = false;
  @Input() searchPlaceholder = 'Buscar...';
  @Input() searchIcon?: LucideIconData;
  @Input() searchValue = '';
  @Input() loading = false;

  @Output() headerAction = new EventEmitter<string>();
  @Output() rowAction = new EventEmitter<{ actionKey: string; row: unknown }>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() pageChange = new EventEmitter<number>();

  protected get totalRows(): number {
    if (this.totalItems && this.totalItems > 0) {
      return this.totalItems;
    }
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
    return (this.page - 1) * this.pageSize + 1;
  }

  protected get endIndex(): number {
    if (!this.totalRows) {
      return 0;
    }
    const end = this.page * this.pageSize;
    return end > this.totalRows ? this.totalRows : end;
  }

  protected get pagedRows(): unknown[] {
    return this.rows;
  }

  protected onPageSizeChange(value: string): void {
    const size = Number(value);
    if (!Number.isNaN(size) && size > 0) {
      this.pageSizeChange.emit(size);
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

  protected onPreviousPage(): void {
    if (this.page <= 1) {
      return;
    }
    this.pageChange.emit(this.page - 1);
  }

  protected onNextPage(): void {
    if (this.page >= this.totalPages) {
      return;
    }
    this.pageChange.emit(this.page + 1);
  }

  protected resolveRowActionClasses(action: DataTableRowAction, row: unknown): (string | null)[] {
    const classes: (string | null)[] = [
      'data-table__row-action-btn--' + (action.variant || 'ghost'),
      'data-table__row-action-btn--action-' + action.key,
    ];

    const extra = action.getClass?.(row);

    if (Array.isArray(extra)) {
      classes.push(...extra);
    } else if (extra) {
      classes.push(extra);
    }

    return classes;
  }
}
