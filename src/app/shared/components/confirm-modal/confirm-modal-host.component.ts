import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { ConfirmModalComponent } from './confirm-modal.component';

@Component({
  selector: 'app-confirm-modal-host',
  standalone: true,
  imports: [ConfirmModalComponent],
  templateUrl: './confirm-modal-host.component.html',
  styleUrl: './confirm-modal-host.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmModalHostComponent {
  protected readonly confirmDialogService = inject(ConfirmDialogService);

  protected closeFromBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.confirmDialogService.closeFromBackdrop();
    }
  }
}
