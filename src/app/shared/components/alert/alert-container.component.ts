import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AlertPosition } from '../../../core/models/alert/alert.model';
import { AlertService } from '../../../core/services/alert.service';
import { AlertComponent } from './alert.component';

@Component({
  selector: 'app-alert-container',
  standalone: true,
  imports: [AlertComponent],
  template: `
    @for (position of positions; track position) {
      @if (getAlerts(position).length) {
        <section
          class="pointer-events-none fixed inset-0 z-50 flex p-4 sm:p-6"
          [class]="getContainerClasses(position)"
          aria-live="polite"
          aria-atomic="true"
        >
          <div class="flex w-full gap-3" [class]="getListClasses(position)">
            @for (alert of getAlerts(position); track alert.id) {
              <div class="pointer-events-auto w-full max-w-md">
                <app-alert [alert]="alert" (closed)="alertService.close($event)" />
              </div>
            }
          </div>
        </section>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertContainerComponent {
  protected readonly alertService = inject(AlertService);

  protected readonly positions: AlertPosition[] = [
    'top-left',
    'top-center',
    'top-right',
    'center-left',
    'center',
    'center-right',
    'bottom-left',
    'bottom-center',
    'bottom-right',
  ];

  protected getAlerts(position: AlertPosition) {
    return this.alertService.getAlertsByPosition(position);
  }

  protected getContainerClasses(position: AlertPosition): string {
    const classMap: Record<AlertPosition, string> = {
      'top-left': 'items-start justify-start',
      'top-center': 'items-start justify-center',
      'top-right': 'items-start justify-end',
      'center-left': 'items-center justify-start',
      center: 'items-center justify-center',
      'center-right': 'items-center justify-end',
      'bottom-left': 'items-end justify-start',
      'bottom-center': 'items-end justify-center',
      'bottom-right': 'items-end justify-end',
    };

    return classMap[position];
  }

  protected getListClasses(position: AlertPosition): string {
    const classMap: Record<AlertPosition, string> = {
      'top-left': 'max-w-md flex-col items-stretch',
      'top-center': 'max-w-md flex-col items-center',
      'top-right': 'max-w-md flex-col items-stretch',
      'center-left': 'max-w-md flex-col items-stretch',
      center: 'max-w-md flex-col items-center',
      'center-right': 'max-w-md flex-col items-stretch',
      'bottom-left': 'max-w-md flex-col-reverse items-stretch',
      'bottom-center': 'max-w-md flex-col-reverse items-center',
      'bottom-right': 'max-w-md flex-col-reverse items-stretch',
    };

    return classMap[position];
  }
}
