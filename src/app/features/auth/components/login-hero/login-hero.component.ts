import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LoginContactListComponent } from '../login-contact-list/login-contact-list.component';
import { LoginContactItem } from '../../models/login-contact-item.model';

@Component({
  selector: 'app-login-hero',
  standalone: true,
  imports: [LoginContactListComponent],
  templateUrl: './login-hero.component.html',
  styleUrl: './login-hero.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginHeroComponent {
  @Input() contacts: LoginContactItem[] = [];
}
