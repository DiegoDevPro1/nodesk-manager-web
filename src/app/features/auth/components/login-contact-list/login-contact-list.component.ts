import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Globe, LucideAngularModule, LucideIconData, Mail, MapPin, Phone } from 'lucide-angular';
import { LoginContactIcon, LoginContactItem } from '../../models/login-contact-item.model';

@Component({
  selector: 'app-login-contact-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './login-contact-list.component.html',
  styleUrl: './login-contact-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginContactListComponent {
  @Input() items: LoginContactItem[] = [];

  protected readonly iconMap: Record<LoginContactIcon, LucideIconData> = {
    phone: Phone,
    mail: Mail,
    globe: Globe,
    location: MapPin,
  };
}
