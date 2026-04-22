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
  @Input() options: FormRadioOption[] = [];
  @Input() direction: 'row' | 'column' = 'row';
  @Input() value: string | null = null;
  @Input() error?: string;

  @Output() valueChange = new EventEmitter<string>();

  protected onSelect(value: string): void {
    this.value = value;
    this.valueChange.emit(value);
  }
}

