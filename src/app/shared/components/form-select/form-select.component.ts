import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export interface FormSelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-form-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-select.component.html',
  styleUrl: './form-select.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormSelectComponent {
  @Input() label = '';
  @Input() placeholder: string | undefined = 'Seleccione una opción';
  @Input() required = false;
  @Input() disabled = false;
  @Input() hint?: string;
  @Input() error?: string;
  @Input() value: string | null = null;
  @Input() options: FormSelectOption[] = [];

  @Output() valueChange = new EventEmitter<string | null>();

  protected onChange(value: string): void {
    this.value = value || null;
    this.valueChange.emit(this.value);
  }
}
