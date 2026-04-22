import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-input.component.html',
  styleUrl: './form-input.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormInputComponent {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type: 'text' | 'email' | 'password' | 'tel' | 'number' = 'text';
  @Input() required = false;
  @Input() disabled = false;
  @Input() hint?: string;
  @Input() error?: string;
  @Input() value = '';

  @Output() valueChange = new EventEmitter<string>();

  protected onInput(value: string): void {
    this.value = value;
    this.valueChange.emit(value);
  }
}
