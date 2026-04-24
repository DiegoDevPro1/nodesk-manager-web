import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';

@Component({
  selector: 'app-detail-field',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './detail-field.component.html',
  styleUrl: './detail-field.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailFieldComponent {
  @Input() label = '';
  @Input() value: string | number | null | undefined = null;
  @Input() icon?: LucideIconData;
  @Input() variant: 'default' | 'badge' = 'default';
  @Input() emptyText = 'No definido';

  get hasValue(): boolean {
    return this.value !== null && this.value !== undefined && String(this.value).trim() !== '';
  }
}
