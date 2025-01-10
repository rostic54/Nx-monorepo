import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { HeaderComponent } from '@angular-monorepo/ui'
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule, RouterModule, ProgressSpinnerModule, ToastModule, HeaderComponent],
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'atm';
  isLoading = false;
}
