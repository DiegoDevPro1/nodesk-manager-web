import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export interface FormRadioOption {
  label: string;
  value: string;
  description?: string;
}

@Component({
  selector: 'app-form-radio-group',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-radio-group.component.html',
  styleUrl: './form-radio-group.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormRadioGroupComponent {
  @Input() label = '';
  @Input() name = 'form-radio-group';
  @Input() required = false;
  @Input() disabled = false;
  @Input() hint?: string;
  @Input() error?: string;
  @Input() value: string | null = null;
  @Input() options: FormRadioOption[] = [];

  @Output() valueChange = new EventEmitter<string | null>();

  protected onChange(value: string): void {
    this.value = value || null;
    this.valueChange.emit(this.value);
  }
}

