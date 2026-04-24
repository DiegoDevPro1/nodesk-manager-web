import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideAngularModule, Eye, EyeOff } from 'lucide-angular';

@Component({
  selector: 'app-form-password-input',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './form-password-input.component.html',
  styleUrl: './form-password-input.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormPasswordInputComponent {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() hint?: string;
  @Input() error?: string;
  @Input() value = '';

  @Output() valueChange = new EventEmitter<string>();

  protected showPassword = false;

  protected readonly eyeIcon = Eye;
  protected readonly eyeOffIcon = EyeOff;

  protected get inputType(): 'text' | 'password' {
    return this.showPassword ? 'text' : 'password';
  }

  protected onInput(value: string): void {
    this.value = value;
    this.valueChange.emit(value);
  }

  protected onToggleVisibility(): void {
    if (this.disabled) {
      return;
    }
    this.showPassword = !this.showPassword;
  }
}

