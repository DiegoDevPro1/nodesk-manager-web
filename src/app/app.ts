import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertContainerComponent } from './shared/components/alert/alert-container.component';
import { ConfirmModalHostComponent } from './shared/components/confirm-modal/confirm-modal-host.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AlertContainerComponent, ConfirmModalHostComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
